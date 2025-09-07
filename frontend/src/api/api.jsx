// src/api/api.jsx
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if your backend uses cookies/sessions
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        api.defaults.headers.Authorization = `Bearer ${access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (userData) => api.put('/auth/profile/', userData),
  changePassword: (passwords) => api.post('/auth/change-password/', passwords),
  requestPasswordReset: (email) => api.post('/auth/password-reset/', { email }),
  confirmPasswordReset: (data) => api.post('/auth/password-reset/confirm/', data),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users/', { params }),
  getUser: (id) => api.get(`/users/${id}/`),
  updateUser: (id, userData) => api.put(`/users/${id}/`, userData),
  deleteUser: (id) => api.delete(`/users/${id}/`),
  verifyUser: (id) => api.post(`/users/${id}/verify/`),
  banUser: (id) => api.post(`/users/${id}/ban/`),
};

// Listings API
export const listingsAPI = {
  getListings: (params) => api.get('/listings/', { params }),
  getListing: (id) => api.get(`/listings/${id}/`),
  createListing: (listingData) => api.post('/listings/', listingData),
  updateListing: (id, listingData) => api.put(`/listings/${id}/`, listingData),
  deleteListing: (id) => api.delete(`/listings/${id}/`),
  uploadImage: (id, imageData) => api.post(`/listings/${id}/images/`, imageData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  favoriteListing: (id) => api.post(`/listings/${id}/favorite/`),
  unfavoriteListing: (id) => api.delete(`/listings/${id}/favorite/`),
  getFavorites: () => api.get('/listings/favorites/'),
};

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get('/categories/'),
};

// Locations API
export const locationsAPI = {
  getLocations: () => api.get('/locations/'),
};

// Reviews API
export const reviewsAPI = {
  getReviews: (params) => api.get('/reviews/', { params }),
  createReview: (reviewData) => api.post('/reviews/', reviewData),
  getUserReviews: (userId) => api.get(`/users/${userId}/reviews/`),
};

// Bookings API
export const bookingsAPI = {
  getBookings: (params) => api.get('/bookings/', { params }),
  getBooking: (id) => api.get(`/bookings/${id}/`),
  createBooking: (bookingData) => api.post('/bookings/', bookingData),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}/`, bookingData),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel/`),
  confirmBooking: (id) => api.post(`/bookings/${id}/confirm/`),
  completeBooking: (id) => api.post(`/bookings/${id}/complete/`),
  getCustomerBookings: () => api.get('/bookings/customer/'),
  getProviderBookings: () => api.get('/bookings/provider/'),
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/conversations/'),
  getConversation: (id) => api.get(`/conversations/${id}/`),
  createConversation: (participantIds, listingId = null) => 
    api.post('/conversations/', { participants: participantIds, listing: listingId }),
  getMessages: (conversationId, params) => api.get(`/conversations/${conversationId}/messages/`, { params }),
  sendMessage: (conversationId, messageData) => api.post(`/conversations/${conversationId}/messages/`, messageData),
  markAsRead: (conversationId) => api.post(`/conversations/${conversationId}/read/`),
  deleteConversation: (id) => api.delete(`/conversations/${id}/`),
};

// Favorites API
export const favoritesAPI = {
  getFavorites: () => api.get('/favorites/'),
  addFavorite: (listingId) => api.post('/favorites/', { listing: listingId }),
  removeFavorite: (listingId) => api.delete(`/favorites/${listingId}/`),
};

// Payments API
export const paymentsAPI = {
  getTransactions: (params) => api.get('/payments/', { params }),
  getTransaction: (id) => api.get(`/payments/${id}/`),
  createPaymentIntent: (paymentData) => api.post('/payments/create-intent/', paymentData),
  confirmPayment: (paymentId) => api.post(`/payments/${paymentId}/confirm/`),
  refundPayment: (paymentId) => api.post(`/payments/${paymentId}/refund/`),
  getPaymentMethods: () => api.get('/payments/methods/'),
  addPaymentMethod: (methodData) => api.post('/payments/methods/', methodData),
  removePaymentMethod: (methodId) => api.delete(`/payments/methods/${methodId}/`),
};

// Subscriptions API
export const subscriptionsAPI = {
  getPlans: () => api.get('/subscriptions/plans/'),
  getPlan: (id) => api.get(`/subscriptions/plans/${id}/`),
  getUserSubscriptions: () => api.get('/subscriptions/'),
  subscribe: (planId) => api.post('/subscriptions/', { plan: planId }),
  cancelSubscription: (id) => api.delete(`/subscriptions/${id}/`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications/', { params }),
  markAsRead: (id) => api.post(`/notifications/${id}/read/`),
  markAllAsRead: () => api.post('/notifications/read-all/'),
  getUnreadCount: () => api.get('/notifications/unread-count/'),
};

// Analytics API
export const analyticsAPI = {
  trackEvent: (eventData) => api.post('/analytics/events/', eventData),
  getStats: (params) => api.get('/analytics/stats/', { params }),
};

// Service Requests API
export const serviceRequestsAPI = {
  getServiceRequests: (params) => api.get('/service-requests/', { params }),
  getServiceRequest: (id) => api.get(`/service-requests/${id}/`),
  createServiceRequest: (requestData) => api.post('/service-requests/', requestData),
  updateServiceRequest: (id, requestData) => api.put(`/service-requests/${id}/`, requestData),
  deleteServiceRequest: (id) => api.delete(`/service-requests/${id}/`),
  closeServiceRequest: (id) => api.post(`/service-requests/${id}/close/`),
  assignServiceRequest: (id, providerId) => api.post(`/service-requests/${id}/assign/`, { provider: providerId }),
};

// Reports API
export const reportsAPI = {
  createReport: (data) => api.post('/reports/', data),
  getReports: (params) => api.get('/reports/', { params }),
  getReport: (id) => api.get(`/reports/${id}/`),
  updateReport: (id, data) => api.put(`/reports/${id}/`, data),
  resolveReport: (id) => api.post(`/reports/${id}/resolve/`),
  dismissReport: (id) => api.post(`/reports/${id}/dismiss/`),
};

// Add this to the existing api.jsx file, around line 250 (after favoritesAPI)

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist/'),
  addToWishlist: (listingId) => api.post('/wishlist/', { listing: listingId }),
  removeFromWishlist: (listingId) => api.delete(`/wishlist/${listingId}/`),
};

export default api;