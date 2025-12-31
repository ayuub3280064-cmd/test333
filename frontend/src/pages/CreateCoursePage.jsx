import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    level: 'beginner',
    status: 'draft',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [chapters, setChapters] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      alert(`Image must be less than ${maxSizeInMB}MB. Your file is ${Math.round(file.size / (1024 * 1024) * 10) / 10}MB.`);
      return;
    }

    // Capture file size in KB
    const sizeInKB = Math.round(file.size / 1024);
    setImageSize(sizeInKB);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({ ...prev, image: reader.result, imageSize: sizeInKB }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData, chapters };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create course');
      }

      navigate('/admin/courses');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Chapter helpers
  const addChapter = () => {
    setChapters(prev => ([...prev, { id: Date.now(), title: '', description: '', items: [] }]));
  };

  const updateChapterField = (index, field, value) => {
    setChapters(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeChapter = (index) => {
    setChapters(prev => prev.filter((_, i) => i !== index));
  };

  const addItemToChapter = (index, type) => {
    const newItem = { id: Date.now(), type, title: '', content: '' };
    setChapters(prev => {
      const next = [...prev];
      next[index] = { ...next[index], items: [...next[index].items, newItem] };
      return next;
    });
  };

  const updateItemField = (chapterIndex, itemIndex, field, value) => {
    setChapters(prev => {
      const next = [...prev];
      const items = [...next[chapterIndex].items];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      next[chapterIndex] = { ...next[chapterIndex], items };
      return next;
    });
  };

  const removeItem = (chapterIndex, itemIndex) => {
    setChapters(prev => {
      const next = [...prev];
      next[chapterIndex] = { ...next[chapterIndex], items: next[chapterIndex].items.filter((_, i) => i !== itemIndex) };
      return next;
    });
  };

  return (
    <div className="admin-courses-page">
      <div className="page-header">
        <h1 className="page-title">
          Create <span className="title-accent">New Course</span>
        </h1>
        <p className="page-subtitle">Add a new course to the platform</p>
      </div>

      {error && (
        <div style={{ color: 'red', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: '#fee2e2' }}>
          Error: {error}
        </div>
      )}

      <div className="form-container" style={{ maxWidth: '600px', margin: '2rem auto', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Course Image
            </label>
            {imagePreview && (
              <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', maxHeight: '200px', background: '#f3f4f6' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px dashed var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            />
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>PNG, JPG or GIF (Max 5MB) {imageSize && `(${imageSize} KB)`}</p>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter course title..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter course description..."
              rows="5"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Level *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="review">Review</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Chapters</h3>
              <button
                type="button"
                onClick={addChapter}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Add Chapter
              </button>
            </div>

            {chapters.length === 0 && (
              <div style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '0.75rem' }}>No chapters yet. Use "Add Chapter" to start building the syllabus.</div>
            )}

            {chapters.map((ch, ci) => (
              <div key={ch.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '10px', marginBottom: '0.75rem', background: '#fff' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder={`Chapter ${ci + 1} title`}
                    value={ch.title}
                    onChange={(e) => updateChapterField(ci, 'title', e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  />
                  <button type="button" onClick={() => addItemToChapter(ci, 'lesson')} style={{ padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer' }}>Add Lesson</button>
                  <button type="button" onClick={() => addItemToChapter(ci, 'quiz')} style={{ padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer' }}>Add Quiz</button>
                  <button type="button" onClick={() => removeChapter(ci)} style={{ padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1px solid #fde68a', background: '#fff7ed', cursor: 'pointer' }}>Remove</button>
                </div>

                <textarea
                  placeholder="Chapter description (optional)"
                  value={ch.description}
                  onChange={(e) => updateChapterField(ci, 'description', e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }}
                />

                {ch.items && ch.items.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {ch.items.map((it, ii) => (
                      <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>{it.type === 'lesson' ? `Lesson ${ii + 1}` : `Quiz ${ii + 1}`}</div>
                          <input
                            type="text"
                            placeholder={it.type === 'lesson' ? 'Lesson title' : 'Quiz title'}
                            value={it.title}
                            onChange={(e) => updateItemField(ci, ii, 'title', e.target.value)}
                            style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '0.35rem' }}
                          />
                          <textarea
                            placeholder={it.type === 'lesson' ? 'Lesson content or notes (optional)' : 'Quiz description / instructions'}
                            value={it.content}
                            onChange={(e) => updateItemField(ci, ii, 'content', e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button type="button" onClick={() => removeItem(ci, ii)} style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', background: '#fff', border: '1px solid #fca5a5', cursor: 'pointer' }}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/courses')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--light-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
