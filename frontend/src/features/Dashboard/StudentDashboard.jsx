import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/enrollments`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setEnrolledCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const completedCount = enrolledCourses.filter(c => c.progress === 100).length;
  const inProgressCount = enrolledCourses.filter(c => c.progress < 100 && c.progress > 0).length;

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
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p className="dashboard-subtitle">Continue your learning journey</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card gradient-blue">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Enrolled Courses</h3>
            <p className="stat-number">{enrolledCourses.length}</p>
          </div>
        </div>
        <div className="stat-card gradient-green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">{completedCount}</p>
          </div>
        </div>
        <div className="stat-card gradient-orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{inProgressCount}</p>
          </div>
        </div>
        <div className="stat-card gradient-purple">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Learning Streak</h3>
            <p className="stat-number">5 days</p>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>My Learning Paths</h2>
          <Link to="/courses" className="btn btn-secondary">Explore More</Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="courses-grid-dashboard">
            {enrolledCourses.map((enrollment) => (
              <div key={enrollment.id} className="course-card-dashboard">
                <div className="course-banner" style={{
                  background: `linear-gradient(135deg, ${['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 4)]}, ${['#a855f7', '#ec4899', '#f43f5e', '#eab308'][Math.floor(Math.random() * 4)]})`
                }}>
                  <span className="course-progress-badge">{enrollment.progress}%</span>
                </div>
                <div className="course-card-body">
                  <h3>{enrollment.course?.name || 'Course'}</h3>
                  <p className="course-instructor">
                    {enrollment.course?.instructor || 'Instructor'}
                  </p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${enrollment.progress}%` }}></div>
                  </div>
                  <p className="progress-text">{enrollment.progress}% Complete</p>
                  <Link to={`/courses/${enrollment.course?.id}`} className="btn btn-primary btn-sm btn-block">
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No courses yet</h3>
            <p>Start learning by enrolling in a course</p>
            <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
