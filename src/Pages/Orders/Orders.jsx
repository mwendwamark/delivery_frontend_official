import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../Config/api';
import { FaSearch, FaFilter, FaDownload, FaRedo, FaShoppingCart, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '30d',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 15
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  // Fetch orders based on filters and pagination
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders({
        ...filters,
        page,
        perPage: pagination.perPage
      });
      
      setOrders(response.orders || []);
      setPagination({
        currentPage: response.meta.current_page || 1,
        totalPages: response.meta.total_pages || 1,
        totalCount: response.meta.total_count || 0,
        perPage: pagination.perPage
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchOrders(page);
      window.scrollTo(0, 0);
    }
  };

  // Handle order selection
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  // Handle receipt download
  const handleDownloadReceipt = async (orderId) => {
    try {
      const response = await ordersAPI.getReceipt(orderId);
      if (response.receipt_url) {
        window.open(response.receipt_url, '_blank');
      }
    } catch (err) {
      console.error('Error downloading receipt:', err);
      alert('Failed to download receipt. Please try again.');
    }
  };

  // Handle reorder
  const handleReorder = (order) => {
    // Add all items to cart
    // This is a simplified version - you'll need to implement your cart logic
    console.log('Reordering:', order);
    alert('Reorder functionality will be implemented soon!');
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'order-status-badge order-status-pending';
      case 'confirmed':
        return 'order-status-badge order-status-confirmed';
      case 'preparing':
        return 'order-status-badge order-status-preparing';
      case 'out_for_delivery':
        return 'order-status-badge order-status-out-for-delivery';
      case 'delivered':
        return 'order-status-badge order-status-delivered';
      case 'cancelled':
        return 'order-status-badge order-status-cancelled';
      default:
        return 'order-status-badge';
    }
  };

  return (
    <div className="order-page-container container section">
      <h1 className="order-page-title">My Orders</h1>
      
      {/* Filters and Search */}
      <div className="order-filters">
        <form onSubmit={handleSearch} className="order-search-form">
          <div className="order-search-box">
            <input
              type="text"
              name="search"
              placeholder="Search by order ID..."
              value={filters.search}
              onChange={handleFilterChange}
              className="order-search-input"
            />
            <button type="submit" className="order-search-button">
              <FaSearch />
            </button>
          </div>
        </form>
        
        <div className="order-filter-controls">
          <div className="order-filter-group">
            <label htmlFor="status-filter" className="order-filter-label">Status:</label>
            <select
              id="status-filter"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="order-filter-select"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="order-filter-group">
            <label htmlFor="date-filter" className="order-filter-label">Date Range:</label>
            <select
              id="date-filter"
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="order-filter-select"
            >
              <option value="30d">Last 30 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="order-loading-state">
          <div className="order-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="order-error-state">
          <p>{error}</p>
          <button onClick={() => fetchOrders()} className="order-retry-button">
            <FaRedo /> Try Again
          </button>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="order-empty-state">
          <p>No orders found matching your criteria.</p>
          <button 
            onClick={() => {
              setFilters({
                status: 'all',
                dateRange: '30d',
                search: ''
              });
            }}
            className="order-clear-filters-button"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {/* Orders List */}
      {!loading && !error && orders.length > 0 && (
        <div className="order-list-container">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-card-id">Order #{order.id}</div>
                <div className="order-card-date">{formatDate(order.created_at)}</div>
                <div className={getStatusBadgeClass(order.status)}>
                  {order.status?.replace(/_/g, ' ').toUpperCase()}
                </div>
              </div>
              
              <div className="order-card-summary">
                <div className="order-items-preview">
                  {order.order_items?.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item-preview">
                      <span className="order-item-name">{item.product?.name || 'Product'}</span>
                      {item.size && <span className="order-item-size">({item.size})</span>}
                      <span className="order-item-quantity">x{item.quantity}</span>
                    </div>
                  ))}
                  {order.order_items?.length > 3 && (
                    <div className="order-more-items">+{order.order_items.length - 3} more items</div>
                  )}
                </div>
                
                <div className="order-card-total">
                  Total: KES {order.total_price?.toFixed(2) || '0.00'}
                </div>
              </div>
              
              <div className="order-card-actions">
                <button 
                  onClick={() => handleOrderClick(order)}
                  className="order-action-button order-view-details"
                >
                  <FaInfoCircle /> View Details
                </button>
                
                {order.status?.toLowerCase() === 'delivered' && (
                  <button 
                    onClick={() => handleDownloadReceipt(order.id)}
                    className="order-action-button order-download-receipt"
                  >
                    <FaDownload /> Receipt
                  </button>
                )}
                
                <button 
                  onClick={() => handleReorder(order)}
                  className="order-action-button order-reorder"
                >
                  <FaShoppingCart /> Reorder
                </button>
              </div>
            </div>
          ))}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="order-pagination">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="order-pagination-button"
              >
                Previous
              </button>
              
              <span className="order-page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="order-pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-modal-overlay">
          <div className="order-details-modal">
            <div className="order-modal-header">
              <h2>Order Details</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="order-close-button"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="order-details-content">
              <div className="order-info-section">
                <div className="order-info-row">
                  <span className="order-info-label">Order ID:</span>
                  <span className="order-info-value">#{selectedOrder.id}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-info-label">Order Date:</span>
                  <span className="order-info-value">{formatDate(selectedOrder.created_at)}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-info-label">Status:</span>
                  <span className={getStatusBadgeClass(selectedOrder.status)}>
                    {selectedOrder.status?.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <div className="order-info-row">
                  <span className="order-info-label">Payment Status:</span>
                  <span className={`order-payment-status order-payment-${selectedOrder.payment_status?.toLowerCase() || 'unknown'}`}>
                    {selectedOrder.payment_status?.toUpperCase() || 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="order-address-section">
                <h3>Delivery Address</h3>
                {selectedOrder.shipping_address ? (
                  <address className="order-address-details">
                    {selectedOrder.shipping_address.street}<br />
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}<br />
                    {selectedOrder.shipping_address.postal_code}<br />
                    {selectedOrder.shipping_address.country}<br />
                    {selectedOrder.shipping_address.phone && (
                      <span>Phone: {selectedOrder.shipping_address.phone}</span>
                    )}
                  </address>
                ) : selectedOrder.address ? (
                  <address className="order-address-details">
                    {selectedOrder.address.street}<br />
                    {selectedOrder.address.city}, {selectedOrder.address.state}<br />
                    {selectedOrder.address.postal_code}<br />
                    {selectedOrder.address.country}
                  </address>
                ) : (
                  <p className="no-address">No delivery address available</p>
                )}
                
                {selectedOrder.delivery_instructions && (
                  <div className="order-delivery-instructions">
                    <h4>Delivery Instructions:</h4>
                    <p>{selectedOrder.delivery_instructions}</p>
                  </div>
                )}
              </div>
              
              <div className="order-items-section">
                <h3>Order Items</h3>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.order_items?.map((item) => {
                      const itemTotal = (item.price_per_unit || 0) * (item.quantity || 1);
                      return (
                        <tr key={item.id} className="order-item-row">
                          <td>
                            <div className="order-product-info">
                              {item.product?.image_url && (
                                <img 
                                  src={item.product.image_url} 
                                  alt={item.product.name}
                                  className="order-product-image"
                                />
                              )}
                              <div>
                                <div className="order-product-name">
                                  {item.product?.name || 'Product'}
                                </div>
                                {item.size && (
                                  <div className="order-variant-details">
                                    <span>Size: {item.size}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="order-item-price">KES{(item.price_per_unit || 0).toFixed(2)}</td>
                          <td className="order-item-quantity">{item.quantity}</td>
                          <td className="order-item-total">KES{itemTotal.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="order-subtotal-row">
                      <td colSpan="3" className="order-total-label">Subtotal:</td>
                      <td className="order-total-amount">${selectedOrder.subtotal?.toFixed(2) || '0.00'}</td>
                    </tr>
                    {selectedOrder.delivery_fee > 0 && (
                      <tr className="order-delivery-row">
                        <td colSpan="3" className="order-total-label">Delivery Fee:</td>
                        <td className="order-total-amount">${selectedOrder.delivery_fee?.toFixed(2) || '0.00'}</td>
                      </tr>
                    )}
                    {selectedOrder.discount_amount > 0 && (
                      <tr className="order-discount-row">
                        <td colSpan="3" className="order-total-label">Discount:</td>
                        <td className="order-total-amount">-KES{selectedOrder.discount_amount?.toFixed(2) || '0.00'}</td>
                      </tr>
                    )}
                    <tr className="order-grand-total-row">
                      <td colSpan="3" className="order-total-label">Total:</td>
                      <td className="order-total-amount">KES{selectedOrder.total_price?.toFixed(2) || '0.00'}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="order-modal-actions">
                {selectedOrder.status?.toLowerCase() === 'delivered' && (
                  <button 
                    onClick={() => {
                      handleDownloadReceipt(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                    className="order-action-button order-download-receipt"
                  >
                    <FaDownload /> Download Receipt
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    handleReorder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="order-action-button order-reorder"
                >
                  <FaShoppingCart /> Reorder All Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
