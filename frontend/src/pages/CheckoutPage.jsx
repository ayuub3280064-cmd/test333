import React from 'react';

const CheckoutPage = () => {
  const [loading, setLoading] = React.useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    // Implement payment processing here
    setLoading(false);
  };

  return (
    <div className="page-content">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <button onClick={handleCheckout} className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Complete Payment'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
