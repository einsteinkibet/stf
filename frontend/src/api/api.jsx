// src/api/api.jsx
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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
    
    if (error.response.status === 401 && !originalRequest._retry) {
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
        // Redirect to login if refresh fails
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
  promoteListing: (id, packageId) => api.post(`/listings/${id}/promote/`, { package: packageId }),
};

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get('/categories/'),
  getCategory: (id) => api.get(`/categories/${id}/`),
};

// Locations API
export const locationsAPI = {
  getLocations: () => api.get('/locations/'),
  getLocation: (id) => api.get(`/locations/${id}/`),
};

// Reviews API
export const reviewsAPI = {
  getReviews: (params) => api.get('/reviews/', { params }),
  getReview: (id) => api.get(`/reviews/${id}/`),
  createReview: (reviewData) => api.post('/reviews/', reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}/`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}/`),
  approveReview: (id) => api.post(`/reviews/${id}/approve/`),
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
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/conversations/'),
  getConversation: (id) => api.get(`/conversations/${id}/`),
  getMessages: (conversationId) => api.get(`/conversations/${conversationId}/messages/`),
  sendMessage: (conversationId, messageData) => api.post(`/conversations/${conversationId}/messages/`, messageData),
  markAsRead: (conversationId) => api.post(`/conversations/${conversationId}/read/`),
};

// Payments API
export const paymentsAPI = {
  getTransactions: (params) => api.get('/payments/', { params }),
  getTransaction: (id) => api.get(`/payments/${id}/`),
  createPaymentIntent: (paymentData) => api.post('/payments/create-intent/', paymentData),
  confirmPayment: (paymentId) => api.post(`/payments/${paymentId}/confirm/`),
  refundPayment: (paymentId) => api.post(`/payments/${paymentId}/refund/`),
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

// Ads API
export const adsAPI = {
  getCampaigns: () => api.get('/ads/campaigns/'),
  createCampaign: (campaignData) => api.post('/ads/campaigns/', campaignData),
  getAdImpressions: (campaignId) => api.get(`/ads/campaigns/${campaignId}/impressions/`),
  getAdClicks: (campaignId) => api.get(`/ads/campaigns/${campaignId}/clicks/`),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist/'),
  addToWishlist: (listingId) => api.post('/wishlist/', { listing: listingId }),
  removeFromWishlist: (listingId) => api.delete(`/wishlist/${listingId}/`),
};

export default api;
