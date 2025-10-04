const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: `${API_BASE_URL}/users`,
    SIGN_IN: `${API_BASE_URL}/users/sign_in`,
    SIGN_OUT: `${API_BASE_URL}/users/sign_out`,
  },
  PRODUCTS: {
    GET_ALL: `${API_BASE_URL}/products`,
    GET_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
  },
  // Paystack and Orders endpoints
  ORDERS: {
    LIST: (params = '') => `${API_BASE_URL}/api/orders${params ? `?${new URLSearchParams(params).toString()}` : ''}`,
    CREATE_CASH_ON_DELIVERY: `${API_BASE_URL}/api/orders/create_cash_on_delivery`,
    GET_STATUS: (id) => `${API_BASE_URL}/api/orders/${id}/status`,
    GET_RECEIPT: (id) => `${API_BASE_URL}/api/orders/${id}/receipt`,
  },
  PAYSTACK: {
    INITIATE_PAYMENT: `${API_BASE_URL}/api/paystack_initiate_payment`,
    CALLBACK: `${API_BASE_URL}/api/paystack_callback`,
  },
};

// Helper function for API calls
const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // Get auth token from storage if it exists
  const token =
    sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
  if (token) {
    defaultOptions.headers["Authorization"] = `Bearer ${token}`;
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      // Try to get error message from response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.error ||
          `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export const authAPI = {
  // Sign up a new user
  signUp: (userData) => {
    return apiCall(API_ENDPOINTS.AUTH.SIGN_UP, {
      method: "POST",
      body: JSON.stringify({ user: userData }),
    });
  },

  // Sign in user
  signIn: (credentials) => {
    return apiCall(API_ENDPOINTS.AUTH.SIGN_IN, {
      method: "POST",
      body: JSON.stringify({ user: credentials }),
    });
  },

  // Sign out user
  signOut: () => {
    return apiCall(API_ENDPOINTS.AUTH.SIGN_OUT, {
      method: "DELETE",
    });
  },
};

export const productsAPI = {
  // Get all products
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${API_ENDPOINTS.PRODUCTS.GET_ALL}?${queryString}` 
      : API_ENDPOINTS.PRODUCTS.GET_ALL;
    return apiCall(url, { method: "GET" });
  },

  // Get product by ID
  getById: (id) => {
    return apiCall(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id), {
      method: "GET"
    });
  },
};

// Orders API
export const ordersAPI = {
  // Get orders with optional filters and pagination
  getOrders: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      per_page: filters.perPage || 15,
      status: filters.status,
      date_range: filters.dateRange,
      search: filters.search
    };
    
    // Remove undefined or null values
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
    
    const response = await apiCall(API_ENDPOINTS.ORDERS.LIST(params));
    return response;
  },

  // CreateCash on Delivery order
  createCashOnDelivery: async (orderData) => {
    const response = await apiCall(API_ENDPOINTS.ORDERS.CREATE_CASH_ON_DELIVERY, {
      method: 'POST',
      body: JSON.stringify({ order: orderData }),
    });
    return response;
  },

  // Get order status
  getStatus: async (orderId) => {
    const response = await apiCall(API_ENDPOINTS.ORDERS.GET_STATUS(orderId));
    return response;
  },

  // Get order receipt
  getReceipt: async (orderId) => {
    const response = await apiCall(API_ENDPOINTS.ORDERS.GET_RECEIPT(orderId));
    return response;
  },

  // Get receipt info
  getReceiptInfo: async (orderId) => {
    const response = await apiCall(`${API_ENDPOINTS.ORDERS.GET_RECEIPT(orderId)}_info`);
    return response;
  },
  
  // Generate receipt
  generateReceipt: async (orderId) => {
    const response = await apiCall(`${API_ENDPOINTS.ORDERS.GET_RECEIPT(orderId)}/generate`, {
      method: 'POST'
    });
    return response;
  }
};

// Paystack API
export const paystackAPI = {
  // Initiate Paystack payment
  initiatePayment: (paymentData) => {
    return apiCall(API_ENDPOINTS.PAYSTACK.INITIATE_PAYMENT, {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },
  
  // Handle Paystack callback
  handleCallback: (reference) => {
    return apiCall(`${API_ENDPOINTS.PAYSTACK.CALLBACK}?reference=${reference}`, {
      method: "GET"
    });
  }
};

export { API_BASE_URL, API_ENDPOINTS, apiCall };