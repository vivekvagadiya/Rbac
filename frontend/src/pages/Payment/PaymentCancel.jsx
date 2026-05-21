import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentCancel.css';

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/payment');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleContactSupport = () => {
    // You can implement a contact support modal or navigate to a support page
    window.location.href = 'mailto:support@yourcompany.com';
  };

  return (
    <div className="payment-cancel-container">
      <div className="cancel-content">
        <div className="cancel-icon">
          <div className="cancel-circle">
            <div className="cancel-x"></div>
          </div>
        </div>
        
        <h1>Payment Cancelled</h1>
        <p className="cancel-message">
          Your payment was cancelled. No charges were made to your account.
        </p>
        
        <div className="cancel-info">
          <h2>What happened?</h2>
          <p>
            You cancelled the payment process, or the payment session expired. 
            Your order was not completed and no payment was processed.
          </p>
          
          <div className="info-points">
            <div className="info-point">
              <span className="point-icon">🛡️</span>
              <div className="point-content">
                <strong>No charges incurred</strong>
                <p>Your payment method was not charged</p>
              </div>
            </div>
            
            <div className="info-point">
              <span className="point-icon">🛒</span>
              <div className="point-content">
                <strong>Cart items preserved</strong>
                <p>Your selected items are still available for purchase</p>
              </div>
            </div>
            
            <div className="info-point">
              <span className="point-icon">🔄</span>
              <div className="point-content">
                <strong>Try again anytime</strong>
                <p>You can complete your purchase whenever you're ready</p>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleTryAgain} className="btn-primary">
            Try Payment Again
          </button>
          <button onClick={handleViewOrders} className="btn-secondary">
            View My Orders
          </button>
        </div>

        <div className="support-section">
          <h3>Need Help?</h3>
          <p>
            If you encountered any issues during the payment process or have questions,
            our support team is here to help.
          </p>
          <button onClick={handleContactSupport} className="btn-support">
            Contact Support
          </button>
        </div>

        <div className="reassurance">
          <p>
            <strong>Your security is our priority.</strong> All payment information is encrypted 
            and processed securely through Stripe's payment system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
