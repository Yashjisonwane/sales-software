// Centralized API Configuration
// This ensures that both the APK and Software use the same versioning and paths.

export const API_BASE_URL = 'http://localhost:4000/api/v1';

export const ENDPOINTS = {
    LEADS: '/leads',
    PROFESSIONALS: '/users/workers',
    ASSIGNMENTS: '/assignments',
    JOBS: '/jobs',
    CHATS: '/chats',
    AUTH: '/auth',
    CATEGORIES: '/categories',
    LOCATIONS: '/locations',
    SUBSCRIPTIONS: '/leads/subscriptions'
};

export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
