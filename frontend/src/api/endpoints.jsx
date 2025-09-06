// src/api/endpoints.js
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    PROFILE: '/auth/profile/',
    CHANGE_PASSWORD: '/auth/change-password/',
    PASSWORD_RESET: '/auth/password-reset/',
    PASSWORD_RESET_CONFIRM: '/auth/password-reset/confirm/',
    TOKEN_REFRESH: '/auth/token/refresh/',
    TOKEN_VERIFY: '/auth/token/verify/',
  },
  
  // User endpoints
  USERS: {
    BASE: '/users/',
    DETAIL: (id) => `/users/${id}/`,
    VERIFY: (id) => `/users/${id}/verify/`,
    BAN: (id) => `/users/${id}/ban/`,
  },
  
  // Listing endpoints
  LISTINGS: {
    BASE: '/listings/',
    DETAIL: (id) => `/listings/${id}/`,
    IMAGES: (id) => `/listings/${id}/images/`,
    FAVORITE: (id) => `/listings/${id}/favorite/`,
    PROMOTE: (id) => `/listings/${id}/promote/`,
    FAVORITES: '/listings/favorites/',
  },
  
  // Category endpoints
  CATEGORIES: {
    BASE: '/categories/',
    DETAIL: (id) => `/categories/${id}/`,
  },
  
  // Location endpoints
  LOCATIONS: {
    BASE: '/locations/',
    DETAIL: (id) => `/locations/${id}/`,
  },
  
  // Review endpoints
  REVIEWS: {
    BASE: '/reviews/',
    DETAIL: (id) => `/reviews/${id}/`,
    APPROVE: (id) => `/reviews/${id}/approve/`,
  },
  
  // Booking endpoints
  BOOKINGS: {
    BASE: '/bookings/',
    DETAIL: (id) => `/bookings/${id}/`,
    CANCEL: (id) => `/bookings/${id}/cancel/`,
    CONFIRM: (id) => `/bookings/${id}/confirm/`,
    COMPLETE: (id) => `/bookings/${id}/complete/`,
  },
  
  // Message endpoints
  MESSAGES: {
    CONVERSATIONS: '/conversations/',
    CONVERSATION_DETAIL: (id) => `/conversations/${id}/`,
    CONVERSATION_MESSAGES: (id) => `/conversations/${id}/messages/`,
    MARK_AS_READ: (id) => `/conversations/${id}/read/`,
  },
  
  // Payment endpoints
  PAYMENTS: {
    BASE: '/payments/',
    DETAIL: (id) => `/payments/${id}/`,
    CREATE_INTENT: '/payments/create-intent/',
    CONFIRM: (id) => `/payments/${id}/confirm/`,
    REFUND: (id) => `/payments/${id}/refund/`,
  },
  
  // Subscription endpoints
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans/',
    PLAN_DETAIL: (id) => `/subscriptions/plans/${id}/`,
    USER_SUBSCRIPTIONS: '/subscriptions/',
    SUBSCRIBE: '/subscriptions/',
    CANCEL: (id) => `/subscriptions/${id}/`,
  },
  
  // Notification endpoints
  NOTIFICATIONS: {
    BASE: '/notifications/',
    MARK_AS_READ: (id) => `/notifications/${id}/read/`,
    MARK_ALL_READ: '/notifications/read-all/',
    UNREAD_COUNT: '/notifications/unread-count/',
  },
  
  // Analytics endpoints
  ANALYTICS: {
    EVENTS: '/analytics/events/',
    STATS: '/analytics/stats/',
  },
  
  // Ad endpoints
  ADS: {
    CAMPAIGNS: '/ads/campaigns/',
    CAMPAIGN_DETAIL: (id) => `/ads/campaigns/${id}/`,
    IMPRESSIONS: (id) => `/ads/campaigns/${id}/impressions/`,
    CLICKS: (id) => `/ads/campaigns/${id}/clicks/`,
  },
};

export default ENDPOINTS;
