// Website API Configuration
// Unified with APK and Software

export const API_BASE_URL = 'https://api.hinesq.com/v1';

export const ENDPOINTS = {
    CREATE_LEAD: '/leads',
    CONTACT: '/contact',
    SERVICES: '/professionals'
};

export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
