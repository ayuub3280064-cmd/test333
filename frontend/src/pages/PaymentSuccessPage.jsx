import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccessPage = () => {
  return (
    <div className="page-content">
      <div className="success-message">
        <h1>Payment Successful!</h1>
        <p>Your enrollment has been confirmed.</p>
        <Link to="/dashboard/student" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
