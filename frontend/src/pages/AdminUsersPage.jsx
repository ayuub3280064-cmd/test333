import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminUsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || res.statusText);
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);
      setUsers(prev => prev.filter(u => String(u._id) !== String(id)));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const toggleStatus = async (id, newActive) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ active: newActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);
      setUsers(prev => prev.map(u => (u._id === id ? data : u)));
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const filtered = users.filter(u => {
    if (!query) return true;
    return [u.name, u.email, u.role].join(' ').toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="page-container admin-users-page">
      <div className="page-header">
        <h1 className="page-title"><span className="title-accent">User Management</span></h1>
        <p className="page-subtitle">Comprehensive overview of registered users and administrative controls.</p>
      </div>

      <div className="controls">
        <input
          type="search"
          placeholder="Search users by name, email or role"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input-search"
        />
      </div>

      {loading ? (
        <div className="loading">Loading users…</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} className="user-row">
                  <td data-label="Name">{u.name}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Role">{u.role}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${u.active ? 'active' : 'inactive'}`}>{u.active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td data-label="Joined">{new Date(u.createdAt || u._id?.getTimestamp?.() || Date.now()).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    <button className="btn btn-sm" onClick={() => toggleStatus(u._id, !u.active)}>{u.active ? 'Deactivate' : 'Activate'}</button>
                    <button className="btn btn-sm" style={{ marginLeft: 8 }} onClick={() => handleDelete(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty">No users match your search.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
