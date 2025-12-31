import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminInstructorsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterNoCourses, setFilterNoCourses] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!usersRes.ok) throw new Error('Failed to fetch users');
      const users = await usersRes.json();

      const coursesRes = await fetch(`${import.meta.env.VITE_API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const coursesData = coursesRes.ok ? await coursesRes.json() : [];

      // filter instructors
      const instructorsOnly = users.filter(u => u.role === 'instructor');

      // compute course counts
      const counts = {};
      (coursesData || []).forEach(c => {
        const id = c.instructor?._id || c.instructor;
        if (!id) return;
        counts[id] = (counts[id] || 0) + 1;
      });

      const merged = instructorsOnly.map(u => ({
        ...u,
        courseCount: counts[u._id] || 0
      }));

      setInstructors(merged);
      setCourses(coursesData || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeactivate = async (userId, active) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ active: !active })
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this instructor?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = instructors.filter(i => {
    const q = search.trim().toLowerCase();
    if (q) {
      return (i.name || '').toLowerCase().includes(q) || (i.email || '').toLowerCase().includes(q);
    }
    return true;
  }).filter(i => (filterNoCourses ? i.courseCount === 0 : true));

  return (
    <div className="admin-instructors-page">
      <div className="page-header">
        <h1 className="page-title">Instructors <span className="title-accent">Management</span></h1>
        <p className="page-subtitle">Create, edit and manage instructors</p>
      </div>

      <div className="admin-toolbar">
        <button className="toolbar-btn" onClick={() => navigate('/admin/instructors/new')}>+ Add New Instructor</button>
        <input className="input-search" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={filterNoCourses ? 'no' : 'all'} onChange={e => setFilterNoCourses(e.target.value === 'no')}>
          <option value="all">All Instructors</option>
          <option value="no">Only with no courses</option>
        </select>
      </div>

      {error && <div style={{ color: 'red', padding: '1rem' }}>{error}</div>}

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading instructors...</div>
      ) : (
        <div className="courses-table-wrapper">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Courses</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inst => (
                <tr key={inst._id} className="course-row">
                  <td data-label="Name"><Link to={`/admin/instructors/${inst._id}/edit`} className="course-link">{inst.name}</Link></td>
                  <td data-label="Email">{inst.email}</td>
                  <td data-label="Courses">{inst.courseCount}</td>
                  <td data-label="Status"><span className={`status-badge ${inst.active ? 'active' : 'inactive'}`}>{inst.active ? 'Active' : 'Inactive'}</span></td>
                  <td data-label="Joined">{new Date(inst.createdAt).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    <Link to={`/admin/instructors/${inst._id}/edit`} className="action-btn">✏️</Link>
                    <button className="action-btn" onClick={() => handleDeactivate(inst._id, inst.active)}>{inst.active ? 'Deactivate' : 'Activate'}</button>
                    <button className="action-btn danger" onClick={() => handleDelete(inst._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: '1rem', textAlign: 'center' }}>No instructors found.</div>}
        </div>
      )}
    </div>
  );
}
