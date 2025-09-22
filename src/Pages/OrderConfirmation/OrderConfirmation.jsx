// frontend/src/pages/OrderConfirmationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../Config/api';
import "./OrderConfirmation.css";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getStatus(orderId);
      setOrderDetails(data);
      setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    try {
      // Use download_url from the API response for direct S3 download
      const receiptUrl = orderDetails.download_url || orderDetails.receipt_url;
      if (!receiptUrl) {
        throw new Error('Receipt URL not available');
      }

      const link = document.createElement('a');
      link.href = receiptUrl;
      link.download = `receipt_order_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Error</h2>
          <p className="error-message">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="error-button"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page section">
      <div className="order-confirmation-container">
        {showAnimation && (
          <div className="animation-overlay">
            <div className="animation-card">
              <div className="checkmark-container">
                <div className="checkmark-inner-circle">
                  <svg 
                    className="checkmark-icon"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <div className="checkmark-ping"></div>
              </div>
              <h2 className="animation-title">Payment Successful!</h2>
              <p className="animation-subtitle">Your order has been confirmed</p>
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot" style={{animationDelay: '0.1s'}}></div>
                <div className="dot" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}

        <div className="order-card">
          <div className="order-card-header">
            <div className="header-content">
              <div>
                <h1 className="header-title">Order Confirmed!</h1>
                <p className="header-subtitle">Thank you for your purchase</p>
              </div>
              <div className="text-right">
                <div className="header-icon-container">
                  <svg className="header-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="order-card-body">
            <div className="order-details-grid">
              <div>
                <h3 className="summary-title">Order Summary</h3>
                <div className="summary-card">
                  <div className="summary-item">
                    <span className="summary-label">Order ID:</span>
                    <span className="summary-value">#{orderDetails.id}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Payment Status:</span>
                    <span className={`payment-status-badge ${
                      orderDetails.payment_status === 'Paystack Paid' 
                        ? 'status-paid' 
                        : 'status-pending'
                    }`}>
                      {orderDetails.payment_status}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Order Status:</span>
                    <span className={`order-status-badge ${
                      orderDetails.status === 'confirmed' 
                        ? 'status-confirmed' 
                        : 'status-other'
                    }`}>
                      {orderDetails.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="next-steps-title">What's Next?</h3>
                <div className="next-steps-list">
                  <div className="step-item">
                    <div className="step-number-container green">
                      <span className="step-number">1</span>
                    </div>
                    <p className="step-text">Your order is being prepared</p>
                  </div>
                  <div className="step-item">
                    <div className="step-number-container blue">
                      <span className="step-number blue">2</span>
                    </div>
                    <p className="step-text">You'll receive updates via email</p>
                  </div>
                  <div className="step-item">
                    <div className="step-number-container purple">
                      <span className="step-number purple">3</span>
                    </div>
                    <p className="step-text">Delivery will be scheduled shortly</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <div className="button-group">
                {orderDetails.receipt_url ? (
                  <button
                    onClick={downloadReceipt}
                    className="action-button btn-download"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Receipt</span>
                  </button>
                ) : (
                  <div className="action-button btn-orders-disabled">
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.0030 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Receipt Generating...</span>
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/products')}
                  className="action-button btn-shopping"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Continue Shopping</span>
                </button>
                
                <button
                  onClick={() => navigate('/orders')}
                  className="action-button btn-orders"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>View All Orders</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-content">
            <div className="info-icon-container">
              <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="info-title">Important Information</h4>
              <ul className="info-list">
                <li>• Keep your order confirmation for your records</li>
                <li>• You'll receive email updates about your delivery</li>
                <li>• For support, contact us with your order ID</li>
                <li>• Delivery typically takes 1-2 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;