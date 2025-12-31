import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function CreateInstructorPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, role: 'instructor' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create instructor');
      navigate('/admin/instructors');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="admin-instructors-page">
      <div className="page-header">
        <h1 className="page-title">Create <span className="title-accent">Instructor</span></h1>
        <p className="page-subtitle">Add a new instructor account</p>
      </div>

      {error && <div style={{ color: 'red', padding: '1rem' }}>{error}</div>}

      <div className="form-container" style={{ maxWidth: 700, margin: '1.5rem auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Name</label>
            <input name="name" required value={formData.name} onChange={handleChange} className="input-search" />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className="input-search" />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Password</label>
            <input name="password" type="password" required value={formData.password} onChange={handleChange} className="input-search" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="action-btn" onClick={() => navigate('/admin/instructors')}>Cancel</button>
            <button type="submit" className="toolbar-btn" disabled={loading}>{loading ? 'Creating...' : 'Create Instructor'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
