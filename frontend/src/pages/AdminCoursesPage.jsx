import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [instructorFilter, setInstructorFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewMode, setViewMode] = useState('card'); // 'list' or 'card'

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (instructorFilter !== 'all') params.append('instructor', instructorFilter);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/admin/list?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      
      setCourses(data.courses || data || []);
      
      // Extract unique instructors from courses
      const uniqueInstructors = [...new Set((data.courses || data)?.map(c => c.instructor?.name || 'Unknown') || [])];
      setInstructors(uniqueInstructors);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, instructorFilter]);

  useEffect(() => {
    fetchCourses();
  }, [search, statusFilter, instructorFilter, currentPage]);

  const handleStatusChange = async (courseId, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/${courseId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) throw new Error('Failed to update status');
      fetchCourses();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/${courseId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to delete course');
      fetchCourses();
    } catch (err) {
      alert('Error deleting course: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'status-green';
      case 'draft':
        return 'status-orange';
      case 'review':
        return 'status-yellow';
      default:
        return '';
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedCourses = courses.slice(startIdx, endIdx);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  return (
    <div className="admin-courses-page">
      <div className="page-header">
        <h1 className="page-title">
          Course <span className="title-accent">Management</span>
        </h1>
        <p className="page-subtitle">Create, edit, and manage courses on the platform</p>
      </div>

      <div className="admin-toolbar">
        <button 
          onClick={() => navigate('/admin/courses/new')}
          className="toolbar-btn"
        >
          + Add New Course
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button type="button" onClick={() => setViewMode('list')} className={`toolbar-btn ${viewMode==='list'?'active':''}`}>List</button>
          <button type="button" onClick={() => setViewMode('card')} className={`toolbar-btn ${viewMode==='card'?'active':''}`}>Card</button>
        </div>
        <input
          type="text"
          className="input-search"
          placeholder="Search courses by title, instructor, or level..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="review">Review</option>
        </select>
        <select
          className="filter-select"
          value={instructorFilter}
          onChange={(e) => setInstructorFilter(e.target.value)}
        >
          <option value="all">All Instructors</option>
          {instructors.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div style={{ color: 'red', padding: '1rem', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading courses...</p>
        </div>
      ) : paginatedCourses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No courses found matching your search.</p>
        </div>
      ) : (
        (viewMode === 'list' ? (
          <div className="courses-table-wrapper">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Instructor</th>
                  <th>Status</th>
                  <th>Enrolled</th>
                  <th>Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map(course => (
                  <tr key={course._id} className="course-row">
                    <td data-label="Course Title">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {course.image && (
                          <img src={course.image} alt={course.title} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                        )}
                        <Link to={`/admin/courses/${course._id}/edit`} className="course-link">
                          {course.title}
                        </Link>
                      </div>
                    </td>
                    <td data-label="Instructor">
                      {course.instructor?.name || 'Unknown'}
                    </td>
                    <td data-label="Status">
                      <select
                        className={`status-select ${getStatusColor(course.status)}`}
                        value={course.status}
                        onChange={(e) => handleStatusChange(course._id, e.target.value)}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="review">Review</option>
                      </select>
                    </td>
                    <td data-label="Enrolled">
                      {course.enrolledCount || 0}
                    </td>
                    <td data-label="Level" className="capitalize">
                      {course.level || 'N/A'}
                    </td>
                    <td data-label="Actions">
                      <Link 
                        to={`/admin/courses/${course._id}/edit`}
                        className="action-btn"
                        title="Edit"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="action-btn danger"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="courses-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {paginatedCourses.map(course => {
              const chapterCount = (course.chapters && course.chapters.length) || 0;
              const isPublished = course.status === 'published';
              const instructorInitials = (course.instructor?.name || 'UN').split(' ').map(n => n[0]).join('').toUpperCase();
              const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];
              const colorIndex = (course._id?.charCodeAt(0) || 0) % colors.length;
              const gradientColor = colors[colorIndex];
              return (
                <div key={course._id} style={{ borderRadius: '12px', overflow: 'hidden', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' }}>
                  {/* Image Header Section */}
                  {course.image ? (
                    <div style={{ height: '280px', background: 'linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '280px', background: `linear-gradient(135deg, ${gradientColor}, ${gradientColor}dd)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ fontSize: '4rem', color: 'white', fontWeight: 700, opacity: 0.15 }}>📚</div>
                      <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                      <div style={{ position: 'absolute', top: '-15px', left: '-15px', width: '50px', height: '50px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
                    </div>
                  )}

                  {/* Card Content */}
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Title and Status Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1f2937', fontWeight: 700 }}>{course.title}</h3>
                      <div className={`status-badge ${getStatusColor(course.status)}`} style={{ padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{course.status}</div>
                    </div>

                    {/* Instructor and Chapters */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${gradientColor}, #9333ea)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>{instructorInitials}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#1f2937', fontSize: '0.9rem', fontWeight: 600 }}>{course.instructor?.name || 'Unknown'}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Instructor</div>
                      </div>
                      <div className="chapter-count" style={{ background: `linear-gradient(90deg, ${gradientColor}, #a855f7)`, color: 'white', padding: '0.3rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>{chapterCount} chapters</div>
                    </div>

                    {/* Description */}
                    <p style={{ color: '#6b7280', marginTop: 0, marginBottom: '0.75rem', fontSize: '0.9rem', lineHeight: 1.4 }}>{course.description ? (course.description.length > 120 ? course.description.slice(0, 120) + '…' : course.description) : 'No description'}</p>

                    {/* Meta info (Enrolled, Level) */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', marginBottom: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        <span style={{ color: '#374151', fontWeight: 600 }}>{course.enrolledCount || 0}</span> enrolled
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        <span style={{ color: '#374151', fontWeight: 600, textTransform: 'capitalize' }}>{course.level || 'N/A'}</span> level
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem', marginLeft: 'auto' }}>
                        <span style={{ color: '#374151', fontWeight: 600 }}>${course.price || '0'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'stretch' }}>
                      <Link to={`/courses/${course._id}`} className="action-btn" style={{ flex: 1, textAlign: 'center' }}>👁️ View</Link>
                      <button onClick={() => handleStatusChange(course._id, isPublished ? 'draft' : 'published')} className="action-btn" style={{ flex: 1 }} title={isPublished ? 'Unpublish' : 'Publish'}>{isPublished ? '✓ Published' : '○ Draft'}</button>
                      <Link to={`/admin/courses/${course._id}/edit`} className="action-btn">✏️</Link>
                      <button onClick={() => handleDelete(course._id)} className="action-btn danger">🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}

      {!loading && paginatedCourses.length > 0 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next → 
          </button>
        </div>
      )}
    </div>
  );
}
