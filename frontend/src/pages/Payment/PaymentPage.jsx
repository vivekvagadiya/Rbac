import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../../data.js';
import { paymentAPI } from '../../api/payment.api.js';
import './PaymentPage.css';

const PaymentPage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleProductSelect = (product) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p._id === product._id);
      if (existing) {
        return prev.map(p => 
          p._id === product._id 
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedProducts(prev => prev.filter(p => p._id !== productId));
    } else {
      setSelectedProducts(prev => 
        prev.map(p => 
          p._id === productId 
            ? { ...p, quantity: newQuantity }
            : p
        )
      );
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p._id !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => 
      total + (product.price * product.quantity), 0
    );
  };

  const handleStripePayment = async () => {
    if (selectedProducts.length === 0) {
      setError('Please select at least one product');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const items = selectedProducts.map(product => ({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        category: product.category
      }));

      const response = await paymentAPI.createCheckoutSession(items);
      
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        setError('Failed to create payment session');
      }
    } catch (error) {
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Complete Your Purchase</h1>
        
        <div className="payment-content">
          {/* Product Selection */}
          <div className="products-section">
            <h2>Available Products</h2>
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">₹{product.price}</p>
                    <p className="product-stock">Stock: {product.stock}</p>
                  </div>
                  <button 
                    className="add-product-btn"
                    onClick={() => handleProductSelect(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Products Cart */}
          <div className="cart-section">
            <h2>Your Cart</h2>
            {selectedProducts.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              <div className="cart-items">
                {selectedProducts.map(product => (
                  <div key={product._id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{product.name}</h4>
                      <p>₹{product.price} each</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                          disabled={product.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{product.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                          disabled={product.quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveProduct(product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="cart-summary">
                  <div className="total-amount">
                    <strong>Total: ₹{calculateTotal()}</strong>
                  </div>
                  <button 
                    className="checkout-btn"
                    onClick={handleStripePayment}
                    disabled={loading || selectedProducts.length === 0}
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default PaymentPage;