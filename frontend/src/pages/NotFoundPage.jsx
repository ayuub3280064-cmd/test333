import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="page-content not-found">
      <h1>404 - Page Not Found</h1>
      <p>Bogga aad raadsanayso ma jiro.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
};

export default NotFoundPage;
