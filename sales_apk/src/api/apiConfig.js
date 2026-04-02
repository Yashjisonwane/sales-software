// Centralized API Configuration for APK Professionals
// Aligned with Website and Software versions

export const API_BASE_URL = 'http://192.168.1.22:4000/api/v1';

export const ENDPOINTS = {
    PROFILE: '/users/profile',
    LEADS: '/leads',
    MY_ASSIGNMENTS: '/jobs',
    UPDATE_JOB: '/jobs',
    TRACKING: '/users/location',
    AUTH: '/auth/login'
};

export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
