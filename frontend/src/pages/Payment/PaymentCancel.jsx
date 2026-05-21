import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentAPI } from '../../api/payment.api.js';
import './PaymentCancel.css';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const handlePaymentCancellation = async () => {
      if (!sessionId) {
        setError('No payment session found');
        setLoading(false);
        return;
      }

      try {
        const response = await paymentAPI.cancelPaymentSession(sessionId);
        
        if (response.success) {
          setCancelled(response.data.isCancelled);
          console.log('Payment cancellation processed:', response.data);
        } else {
          setError('Failed to process payment cancellation');
        }
      } catch (error) {
        console.error('Error cancelling payment:', error);
        setError(error.message || 'Failed to cancel payment');
      } finally {
        setLoading(false);
      }
    };

    handlePaymentCancellation();
  }, [sessionId]);

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

  if (loading) {
    return (
      <div className="payment-cancel-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Processing cancellation...</p>
        </div>
      </div>
    );
  }

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
        
        {cancelled && (
          <div className="cancellation-success">
            <p>✅ Your order has been cancelled and stock has been restored.</p>
          </div>
        )}
        
        {error && (
          <div className="cancellation-error">
            <p>⚠️ {error}</p>
            <p>Your order may still be pending. Please check your orders or contact support.</p>
          </div>
        )}
        
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
