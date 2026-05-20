import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../../api/payment.api.js';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No payment session found');
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const response = await paymentAPI.verifyPaymentSession(sessionId);
      
      if (response.success && response.data.isCompleted) {
        setPaymentData(response.data);
      } else {
        setError('Payment verification failed');
      }
    } catch (error) {
      setError(error.message || 'Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/payment');
  };

  const handleViewOrders = () => {
    navigate('/orders'); // Adjust route as needed
  };

  if (loading) {
    return (
      <div className="payment-success-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-success-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h1>Payment Verification Failed</h1>
          <p>{error}</p>
          <div className="action-buttons">
            <button onClick={handleContinueShopping} className="btn-primary">
              Continue Shopping
            </button>
            <button onClick={() => window.location.reload()} className="btn-secondary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="success-content">
        <div className="success-icon">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>
        
        <h1>Payment Successful!</h1>
        <p className="success-message">
          Thank you for your purchase. Your payment has been successfully processed.
        </p>

        {paymentData && (
          <div className="payment-details">
            <h2>Order Details</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Order ID:</label>
                <span>{paymentData.order._id}</span>
              </div>
              <div className="detail-item">
                <label>Payment Status:</label>
                <span className="status-paid">{paymentData.paymentStatus}</span>
              </div>
              <div className="detail-item">
                <label>Total Amount:</label>
                <span>₹{paymentData.order.totalAmount}</span>
              </div>
              <div className="detail-item">
                <label>Payment Date:</label>
                <span>{new Date(paymentData.session.created * 1000).toLocaleString()}</span>
              </div>
            </div>

            {paymentData.order.products && paymentData.order.products.length > 0 && (
              <div className="order-items">
                <h3>Items Purchased</h3>
                <div className="items-list">
                  {paymentData.order.products.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">
                        {item.product?.name || 'Product'} × {item.quantity}
                      </span>
                      <span className="item-price">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="action-buttons">
          <button onClick={handleContinueShopping} className="btn-primary">
            Continue Shopping
          </button>
          <button onClick={handleViewOrders} className="btn-secondary">
            View My Orders
          </button>
        </div>

        <div className="receipt-info">
          <p>A receipt has been sent to your email address.</p>
          <p>For any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
