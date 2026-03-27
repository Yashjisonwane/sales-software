// ============================================================
// API SERVICE — Unified Facade for real backend operations
// ============================================================

import apiClient from './apiClient';
import { ENDPOINTS } from './apiConfig';

// ─── AUTHENTICATION ──────────────────────────────────────────

export const loginAdmin = async (email, password) => {
    try {
        const response = await apiClient.post(`${ENDPOINTS.AUTH}/login`, { email, password });
        return { success: true, data: response.data.data };
    } catch (err) {
        console.error('[API] loginAdmin error:', err);
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
        // Must send categoryId (dummy category if backend has empty categories)
        const response = await apiClient.post(ENDPOINTS.LEADS, formData);
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

// ... add other workflow actions as needed ...

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
