import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [course, setCourse] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [expandedChapters, setExpandedChapters] = React.useState({});

  React.useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/courses/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );
        if (!response.ok) throw new Error('Failed to fetch course');
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, token]);

  const toggleChapter = (chapterIndex) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex]
    }));
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Course not found</div>
        <button 
          onClick={() => navigate('/admin/courses')}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const chapters = course.chapters || [];

  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];
  const colorIndex = (course._id?.charCodeAt(0) || 0) % colors.length;
  const primaryColor = colors[colorIndex];

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/admin/courses')}
          style={{ background: 'none', border: 'none', color: primaryColor, cursor: 'pointer', fontSize: '1.1rem', marginBottom: '2rem', fontWeight: 600, transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
        >
          ← Back to Courses
        </button>

        {/* Course Header Card */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          {course.image && (
            <div style={{ height: '300px', background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`, overflow: 'hidden', position: 'relative' }}>
              <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <div style={{ padding: '2rem', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 800 }}>{course.title}</h1>
                <p style={{ margin: '0.5rem 0', color: '#6b7280', fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}>
                  By <span style={{ fontWeight: 700, background: `linear-gradient(90deg, ${primaryColor}, #a855f7)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{course.instructor?.name || 'Unknown'}</span>
                </p>
              </div>
              <div style={{ background: course.status === 'published' ? 'linear-gradient(135deg, #43e97b, #38f9d7)' : 'linear-gradient(135deg, #fa709a, #fee140)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {course.status}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{chapters.length}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Chapters</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{course.enrolledCount || 0}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Enrolled</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center', textTransform: 'capitalize' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{course.level || 'N/A'}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Level</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>${course.price || '0'}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Price</div>
              </div>
            </div>

            {course.description && (
              <div style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}08)`, padding: '1.5rem', borderRadius: '8px', borderLeft: `5px solid ${primaryColor}`, borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 0.75rem 0', color: '#1f2937', fontSize: '1.1rem', fontWeight: 700 }}>📝 Description</h3>
                <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.8, fontSize: '1rem' }}>{course.description}</p>
              </div>
            )}
          </div>
        </div>

      {/* Chapters List */}
      <div>
        <h2 style={{ marginBottom: '1.5rem', color: '#1f2937', fontSize: '1.5rem' }}>Course Content</h2>
        
        {chapters.length === 0 ? (
          <div style={{ background: '#f3f4f6', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
            No chapters added yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: 'white' }}>
                {/* Chapter Header */}
                <button
                  onClick={() => toggleChapter(chapterIndex)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: expandedChapters[chapterIndex] ? '#f3f4f6' : 'white',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    borderBottom: expandedChapters[chapterIndex] ? '1px solid #e5e7eb' : 'none'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.background = expandedChapters[chapterIndex] ? '#f3f4f6' : 'white'}
                >
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ margin: '0', color: '#1f2937', fontSize: '1.1rem' }}>
                      {chapterIndex + 1}. {chapter.title}
                    </h3>
                    {chapter.description && (
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                        {chapter.description}
                      </p>
                    )}
                  </div>
                  <span style={{ color: '#667eea', fontSize: '1.2rem', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                    {expandedChapters[chapterIndex] ? '▼' : '▶'}
                  </span>
                </button>

                {/* Chapter Items (Lessons/Quizzes) */}
                {expandedChapters[chapterIndex] && (
                  <div style={{ padding: '0 1rem 1rem 1rem', background: 'white' }}>
                    {chapter.items && chapter.items.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {chapter.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            style={{
                              display: 'flex',
                              alignItems: 'start',
                              gap: '0.75rem',
                              padding: '0.75rem',
                              background: '#f9fafb',
                              borderRadius: '6px',
                              borderLeft: item.type === 'lesson' ? '4px solid #667eea' : '4px solid #f093fb'
                            }}
                          >
                            <div style={{
                              minWidth: '28px',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: item.type === 'lesson' ? '#667eea' : '#f093fb',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              marginTop: '0.1rem'
                            }}>
                              {item.type === 'lesson' ? '📖' : '❓'}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#1f2937', fontWeight: 600, marginBottom: '0.25rem' }}>
                                {itemIndex + 1}. {item.title}
                              </div>
                              {item.content && (
                                <div style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                  {item.content}
                                </div>
                              )}
                              <div style={{
                                display: 'inline-block',
                                marginTop: '0.5rem',
                                padding: '0.25rem 0.6rem',
                                background: item.type === 'lesson' ? '#dbeafe' : '#fce7f3',
                                color: item.type === 'lesson' ? '#1e40af' : '#831843',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                textTransform: 'capitalize'
                              }}>
                                {item.type}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#9ca3af', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        No lessons or quizzes in this chapter
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
