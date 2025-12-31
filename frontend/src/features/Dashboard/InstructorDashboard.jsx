import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollments?.length || 0), 0);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-circle"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Instructor Portal 👨‍🏫</h1>
          <p className="dashboard-subtitle">Manage your courses and students</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card gradient-blue">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Active Courses</h3>
            <p className="stat-number">{courses.length}</p>
          </div>
        </div>
        <div className="stat-card gradient-green">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Students</h3>
            <p className="stat-number">{totalStudents}</p>
          </div>
        </div>
        <div className="stat-card gradient-orange">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Avg. Rating</h3>
            <p className="stat-number">4.8★</p>
          </div>
        </div>
        <div className="stat-card gradient-purple">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p className="stat-number">$2.4k</p>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Your Courses</h2>
          <Link to="/instructor/courses/new" className="btn btn-primary">+ Create Course</Link>
        </div>

        {courses.length > 0 ? (
          <div className="courses-grid-dashboard">
            {courses.map((course) => (
              <div key={course.id} className="course-card-dashboard">
                <div className="course-banner" style={{
                  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
                }}>
                  <span className="course-status">Active</span>
                </div>
                <div className="course-card-body">
                  <h3>{course.name}</h3>
                  <p className="course-students">
                    👥 {course.enrollments?.length || 0} students
                  </p>
                  <div className="course-stats">
                    <span>${course.price || 'Free'}</span>
                    <span>{course.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="course-actions">
                    <Link to={`/instructor/courses/${course.id}`} className="btn btn-secondary btn-sm btn-block">Edit Course</Link>
                    <Link to={`/instructor/courses/${course.id}/analytics`} className="btn btn-sm btn-block" style={{marginTop: '0.5rem'}}>View Analytics</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>No courses yet</h3>
            <p>Create your first course to start teaching</p>
            <Link to="/instructor/courses/new" className="btn btn-primary">Create Course</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default InstructorDashboard;
