// Centralized API Configuration
// This ensures that both the APK and Software use the same versioning and paths.

export const API_BASE_URL = 'https://api.hinesq.com/v1';

export const ENDPOINTS = {
    LEADS: '/leads',
    PROFESSIONALS: '/professionals',
    ASSIGNMENTS: '/assignments',
    JOBS: '/jobs',
    CHATS: '/chats',
    AUTH: '/auth'
};

export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
