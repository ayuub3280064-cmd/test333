import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function EditInstructorPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', active: true });

  useEffect(() => {
    const fetchUser = async () => {
      try{
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setFormData({ name: data.name || '', email: data.email || '', active: data.active });
      }catch(err){ setError(err.message); }
      finally{ setLoading(false); }
    };
    if (id) fetchUser();
  }, [id, token]);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async e =>{
    e.preventDefault();
    setSaving(true); setError(null);
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');
      navigate('/admin/instructors');
    }catch(err){ setError(err.message); }
    finally{ setSaving(false); }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading instructor...</div>;

  return (
    <div className="admin-instructors-page">
      <div className="page-header">
        <h1 className="page-title">Edit <span className="title-accent">Instructor</span></h1>
        <p className="page-subtitle">Update instructor information</p>
      </div>

      {error && <div style={{ color: 'red', padding: 10 }}>{error}</div>}

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
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} /> Active</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="action-btn" onClick={() => navigate('/admin/instructors')}>Cancel</button>
            <button type="submit" className="toolbar-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
