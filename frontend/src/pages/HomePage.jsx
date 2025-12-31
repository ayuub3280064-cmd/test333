import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="page-content">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Aqoonsoor LMS</h1>
          <p>Wadatashi cimri oo casri ah oo furan</p>
          <Link to="/courses" className="btn btn-primary btn-large">Explore Courses</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Online Courses</h3>
          <p>Barashada online oo sawirka leh</p>
        </div>
        <div className="feature-card">
          <h3>Expert Instructors</h3>
          <p>Waxbarasho qoto dheer oo khabarta leh</p>
        </div>
        <div className="feature-card">
          <h3>Flexible Learning</h3>
          <p>Barashada kaa duwa saxda aad runtaa</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
