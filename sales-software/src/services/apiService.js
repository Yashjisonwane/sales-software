// ============================================================
// API SERVICE — Unified Facade for real backend operations
// ============================================================

import apiClient from './apiClient';
import { ENDPOINTS } from './apiConfig';

// ─── AUTHENTICATION ──────────────────────────────────────────

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post(`${ENDPOINTS.AUTH}/login`, { email, password });
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] loginUser error:', err);
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post(`${ENDPOINTS.AUTH}/register`, userData);
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] registerUser error:', err);
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

// ─── LEADS ───────────────────────────────────────────────────

export const submitServiceRequest = async (formData) => {
    try {
        // Map Software form fields to Backend DB fields
        const payload = {
            customerName: formData.customerName,
            email: formData.customerEmail,
            phone: formData.customerPhone,
            categoryName: formData.serviceCategory, // Backend handles string matching
            location: formData.location,
            description: formData.description
        };
        
        const response = await apiClient.post(ENDPOINTS.LEADS, payload);
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] submitServiceRequest error:', err);
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const fetchAllLeads = async () => {
    try {
        const response = await apiClient.get(ENDPOINTS.LEADS);
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] fetchAllLeads error:', err);
        return { success: false, error: err.message };
    }
};

export const assignLeadToWorker = async (leadId, workerId) => {
    try {
        const response = await apiClient.patch(`${ENDPOINTS.LEADS}/${leadId}/assign`, { workerId });
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] assignLead error:', err);
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const updateLead = async (id, data) => {
    try {
        const response = await apiClient.put(`${ENDPOINTS.LEADS}/${id}`, data);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const deleteLead = async (id) => {
    try {
        const response = await apiClient.delete(`${ENDPOINTS.LEADS}/${id}`);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

// ─── CATEGORIES ──────────────────────────────────────────────

export const fetchAllCategories = async () => {
    try {
        const response = await apiClient.get(ENDPOINTS.CATEGORIES);
        return { success: true, data: response.data.data }; 
    } catch (err) {
        console.error('[API] fetchAllCategories error:', err);
        return { success: false, error: err.message };
    }
};

export const createCategory = async (catData) => {
    try {
        const response = await apiClient.post(ENDPOINTS.CATEGORIES, catData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const updateCategory = async (id, catData) => {
    try {
        const response = await apiClient.put(`${ENDPOINTS.CATEGORIES}/${id}`, catData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await apiClient.delete(`${ENDPOINTS.CATEGORIES}/${id}`);
        return { success: true, data: response.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

// ─── JOBS (WORKFLOW) ─────────────────────────────────────────

export const fetchAllJobs = async () => {
    try {
        const response = await apiClient.get(ENDPOINTS.JOBS);
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] fetchAllJobs error:', err);
        return { success: false, error: err.message };
    }
};

export const createJob = async (jobData) => {
    try {
        const response = await apiClient.post(ENDPOINTS.JOBS, jobData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const deleteJob = async (id) => {
    try {
        const response = await apiClient.delete(`${ENDPOINTS.JOBS}/${id}`);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const updateJob = async (id, jobData) => {
    try {
        const response = await apiClient.patch(`${ENDPOINTS.JOBS}/${id}`, jobData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const uploadJobPhotos = async (jobId, photoData) => {
    try {
        const response = await apiClient.post(`${ENDPOINTS.JOBS}/${jobId}/photos`, photoData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const submitJobInspection = async (jobId, inspectionData) => {
    try {
        const response = await apiClient.post(`${ENDPOINTS.JOBS}/${jobId}/inspection`, inspectionData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

// ─── PROFESSIONALS ───────────────────────────────────────────

export const fetchAllProfessionals = async () => {
    try {
        const response = await apiClient.get(ENDPOINTS.PROFESSIONALS);
        return { success: true, data: response.data.data }; 
    } catch (err) {
        console.error('[API] fetchAllProfessionals error:', err);
        return { success: false, error: err.message };
    }
};

export const createProfessional = async (userData) => {
    try {
        const response = await apiClient.post(ENDPOINTS.PROFESSIONALS, userData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const updateProfessional = async (id, userData) => {
    try {
        const response = await apiClient.put(`${ENDPOINTS.PROFESSIONALS}/${id}`, userData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const deleteProfessional = async (id) => {
    try {
        const response = await apiClient.delete(`${ENDPOINTS.PROFESSIONALS}/${id}`);
        return { success: true, data: response.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const updateProfessionalLocation = async (lat, lng) => {
    try {
        const response = await apiClient.patch('/users/location', { lat, lng });
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const updateProfessionalStatus = async (isAvailable) => {
    try {
        const response = await apiClient.patch('/users/status', { isAvailable });
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const updateProfessionalTracking = async (enabled) => {
    try {
        const response = await apiClient.put('/users/profile', { trackingEnabled: enabled });
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

// ─── OTHER DASHBOARD DATA ───────────────────────────────────

export const fetchDashboardStats = async () => {
    try {
        const response = await apiClient.get('/users/dashboard-stats');
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] fetchDashboardStats error:', err);
        return { success: false, error: err.message };
    }
};

export const fetchAllLocations = async () => {
    try {
        const response = await apiClient.get(ENDPOINTS.LOCATIONS);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const createLocation = async (locData) => {
    try {
        const response = await apiClient.post(ENDPOINTS.LOCATIONS, locData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const removeLocation = async (id) => {
    try {
        const response = await apiClient.delete(`${ENDPOINTS.LOCATIONS}/${id}`);
        return { success: true, data: response.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const fetchAllSubscriptions = async () => {
    try {
        const response = await apiClient.get(`${ENDPOINTS.LEADS}/subscriptions`);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const createSubscriptionPlan = async (planData) => {
    try {
        const response = await apiClient.post(`${ENDPOINTS.LEADS}/subscriptions`, planData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const updateSubscriptionPlan = async (id, planData) => {
    try {
        const response = await apiClient.put(`${ENDPOINTS.LEADS}/subscriptions/${id}`, planData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const deleteSubscriptionPlan = async (id) => {
    try {
        const response = await apiClient.delete(`${ENDPOINTS.LEADS}/subscriptions/${id}`);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const fetchActiveSubscriptions = async () => {
    try {
        const response = await apiClient.get(`${ENDPOINTS.LEADS}/subscriptions/active`);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const enrollInSubscription = async (enrollData) => {
    try {
        const response = await apiClient.post(`${ENDPOINTS.LEADS}/subscriptions/enroll`, enrollData);
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await apiClient.get('/users/profile');
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await apiClient.put('/users/profile', userData);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

// ─── PROFESSIONAL REQUESTS ───────────────────────────────────

export const fetchAllProfessionalRequests = async () => {
    try {
        const response = await apiClient.get('/professional-requests');
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] fetchAllProfessionalRequests error:', err);
        return { success: false, error: err.message };
    }
};

export const approveProfessionalRequest = async (id) => {
    try {
        const response = await apiClient.put(`/professional-requests/${id}/approve`);
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] approveProfessionalRequest error:', err);
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const rejectProfessionalRequest = async (id) => {
    try {
        const response = await apiClient.delete(`/professional-requests/${id}/reject`);
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] rejectProfessionalRequest error:', err);
        return { success: false, error: err.response?.data?.message || err.message };
    }
};


export const fetchSubscriptionUpgradeRequests = async () => {
    try {
        const response = await apiClient.get(`${ENDPOINTS.LEADS}/subscriptions/upgrade-requests`);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const approveSubscriptionUpgrade = async (id) => {
    try {
        const response = await apiClient.put(`${ENDPOINTS.LEADS}/subscriptions/upgrade-requests/${id}/approve`);
        return { success: true, data: response.data.message };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const rejectSubscriptionUpgrade = async (id) => {
    try {
        const response = await apiClient.put(`${ENDPOINTS.LEADS}/subscriptions/upgrade-requests/${id}/reject`);
        return { success: true, data: response.data.message };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

// ─── NOTIFICATIONS ───────────────────────────────────────────

export const fetchNotifications = async () => {
    try {
        const response = await apiClient.get('/notifications');
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] fetchNotifications error:', err);
        return { success: false, error: err.message };
    }
};

export const markNotificationRead = async (id) => {
    try {
        const response = await apiClient.patch(`/notifications/${id}/read`);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const clearNotifications = async () => {
    try {
        const response = await apiClient.delete('/notifications/clear');
        return { success: true, data: response.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

// ─── CHATS & MESSAGES ──────────────────────────────────────────

export const fetchAllChats = async () => {
    try {
        const response = await apiClient.get(ENDPOINTS.CHATS);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const fetchChatMessages = async (chatId) => {
    try {
        const response = await apiClient.get(`${ENDPOINTS.CHATS}/${chatId}/messages`);
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const sendChatMessage = async (chatId, text) => {
    try {
        const response = await apiClient.post(`${ENDPOINTS.CHATS}/${chatId}/messages`, { text });
        return { success: true, data: response.data.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

// ─── REVIEWS ─────────────────────────────────────────────────

export const fetchAllReviews = async () => {
    try {
        const response = await apiClient.get(ENDPOINTS.REVIEWS);
        return { success: true, data: response.data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};
