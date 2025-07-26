// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8106/api';

// API endpoints
export const API_ENDPOINTS = {
  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  USER_ORDERS: (userId: number) => `${API_BASE_URL}/orders/user/${userId}`,
  
  // Location
  LOCATION: `${API_BASE_URL}/location`,
  LOCATION_DISTANCE: `${API_BASE_URL}/location/distance`,
  
  // Payment
  PAYMENT: `${API_BASE_URL}/payment`,
  PAYMENT_CONFIRM: `${API_BASE_URL}/payment/confirmTransaction`,
  
  // Cart
  CART: (userId: number) => `${API_BASE_URL}/cart/${userId}`,
  CART_ITEMS: (cartItemId: number) => `${API_BASE_URL}/cart-items/${cartItemId}`,
  
  // Admin endpoints - updated to match backend routes
  ADMIN_ORDERS: `${API_BASE_URL}/admin/orders`,
  ADMIN_ORDER: (orderId: number) => `${API_BASE_URL}/admin/orders/${orderId}`,
};

// Reusable fetch function with error handling
export const fetchApi = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Example API methods
// Update apiService to include admin methods
// Add these methods to your apiService object

export const apiService = {
  // Orders
  getUserOrders: (userId: number) => fetchApi(API_ENDPOINTS.USER_ORDERS(userId)),
  createOrder: (orderData: any) => fetchApi(API_ENDPOINTS.ORDERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  }),
  
  // Location
  getAddressFromCoordinates: (lat: number, lng: number) => 
    fetchApi(`${API_ENDPOINTS.LOCATION}?lat=${lat}&lng=${lng}`),
  
  getRouteDistance: (startLat: number, startLng: number, endLat: number, endLng: number) => 
    fetchApi(`${API_ENDPOINTS.LOCATION_DISTANCE}?startLat=${startLat}&startLng=${startLng}&endLat=${endLat}&endLng=${endLng}`),
  
  // Payment
  processPayment: (paymentData: any) => fetchApi(API_ENDPOINTS.PAYMENT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  }),
  
  // Confirm MOMO payment transaction
  confirmPaymentTransaction: async (momoOrderId: string) => {
    if (!momoOrderId) {
      console.error("Cannot confirm transaction: momoOrderId is empty or undefined");
      return {
        success: false,
        message: "Invalid order ID",
        error: true
      };
    }
    
    try {
      console.log("Confirming transaction for MOMO orderId:", momoOrderId);
      
      // Changed from orderId to id to match backend expectation
      const response = await fetch(API_ENDPOINTS.PAYMENT_CONFIRM, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: momoOrderId }),
      });
      
      if (!response.ok) {
        // Log detailed error information
        console.error(`Error confirming transaction. Status: ${response.status}`);
        
        try {
          const errorData = await response.json();
          console.error("Error response data:", errorData);
          
          // If we get a specific error about the transaction, return it
          if (errorData && errorData.error) {
            return {
              success: false,
              message: errorData.message || "Transaction confirmation failed",
              error: true,
              errorCode: response.status,
              details: errorData.error
            };
          }
        } catch (e) {
          try {
            const errorText = await response.text();
            console.error("Error response text:", errorText);
          } catch (textError) {
            console.error("Could not read error response");
          }
        }
        
        // For 500 errors specifically, provide more context
        if (response.status === 500) {
          console.log("Server error occurred. This might be because the transaction is still processing at MOMO's end.");
          // Return a structured error response instead of throwing
          return {
            success: false,
            message: "Server error occurred while confirming payment",
            error: true,
            errorCode: 500
          };
        }
        
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed in confirmPaymentTransaction:', error);
      // Return a structured error response instead of throwing
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        error: true
      };
    }
  },
  
  // Cart
  getUserCart: (userId: number) => fetchApi(API_ENDPOINTS.CART(userId)),
  
  updateCartItemQuantity: (cartItemId: number, quantity: number) => fetchApi(API_ENDPOINTS.CART_ITEMS(cartItemId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  }),
  
  removeCartItem: (cartItemId: number) => fetchApi(API_ENDPOINTS.CART_ITEMS(cartItemId), {
    method: 'DELETE',
  }),
  
  addToCart: (userId: number, productId: number, quantity: number) => fetchApi(API_ENDPOINTS.CART(userId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  }),
  
  // Admin methods - updated to use correct endpoints
  getAllOrders: async () => {
    try {
      console.log("Fetching all orders from:", API_ENDPOINTS.ADMIN_ORDERS);
      const response = await fetch(API_ENDPOINTS.ADMIN_ORDERS);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Admin orders raw data:", data);
      return data;
    } catch (error) {
      console.error("API error in getAllOrders:", error);
      throw error;
    }
  },
  
  updateOrderStatus: async (orderId: number, statusData: { status?: string, paymentStatus?: string }) => {
    try {
      console.log(`Updating order ${orderId} with data:`, statusData);
      
      // Log what type of update we're doing for debugging
      if (statusData.status) {
        console.log(`This is an ORDER STATUS update to: ${statusData.status}`);
      } else if (statusData.paymentStatus) {
        console.log(`This is a PAYMENT STATUS update to: ${statusData.paymentStatus}`);
      }
      
      // Ensure we're sending valid status values that match the backend enum
      if (statusData.status) {
        // Make sure status is one of the valid enum values from OrderStatus.js
        if (!["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"].includes(statusData.status)) {
          console.error(`Invalid order status value: ${statusData.status}`);
          throw new Error(`Invalid order status: ${statusData.status}`);
        }
      }
      
      if (statusData.paymentStatus) {
        // Make sure paymentStatus is one of the valid enum values
        if (!["PENDING", "PAID", "CANCELED"].includes(statusData.paymentStatus)) {
          console.error(`Invalid payment status value: ${statusData.paymentStatus}`);
          throw new Error(`Invalid payment status: ${statusData.paymentStatus}`);
        }
      }
      
      const response = await fetch(API_ENDPOINTS.ADMIN_ORDER(orderId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData),
      });
      
      // Log the raw response for debugging
      console.log(`Raw response status for order ${orderId} update:`, response.status);
      
      if (!response.ok) {
        let errorMessage = `Error: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("Error response data:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          console.error("Error response text:", errorText);
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log(`API response for order ${orderId} update:`, result);
      
      // Verify that the returned order has the expected status
      if (result.order) {
        if (statusData.status && result.order.status !== statusData.status) {
          console.warn(`Warning: Server returned different status than requested. 
            Requested: ${statusData.status}, Received: ${result.order.status}`);
        }
        if (statusData.paymentStatus && result.order.paymentStatus !== statusData.paymentStatus) {
          console.warn(`Warning: Server returned different payment status than requested. 
            Requested: ${statusData.paymentStatus}, Received: ${result.order.paymentStatus}`);
        }
      }
      
      return result;
    } catch (error) {
      console.error(`API error in updateOrderStatus for order ${orderId}:`, error);
      throw error;
    }
  },
  
  deleteOrder: async (orderId: number) => {
    try {
      console.log(`Deleting order ${orderId}`);
      
      const response = await fetch(API_ENDPOINTS.ADMIN_ORDER(orderId), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API error in deleteOrder for order ${orderId}:`, error);
      throw error;
    }
  },
};