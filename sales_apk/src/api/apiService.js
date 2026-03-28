import apiClient from './apiClient';
import storage from './storage';

/**
 * SERVICE: Worker Authentication
 */
export const loginWorker = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.data.success) {
            await storage.setItem('userToken', response.data.data.token);
            await storage.setItem('userData', JSON.stringify(response.data.data.user));
        }
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
};

/**
 * SERVICE: Leads Management
 */
export const getAvailableLeads = async () => {
    try {
        const response = await apiClient.get('/leads');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Could not fetch leads' };
    }
};

export const acceptLead = async (leadId) => {
    try {
        const response = await apiClient.patch(`/leads/${leadId}/assign`);
        return response.data;
    } catch (error) {
        console.error('Accept Lead API Error:', error.response?.data || error.message);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Could not accept lead. Please try again.' 
        };
    }
};

/**
 * SERVICE: Jobs Management
 */
export const getWorkerJobs = async () => {
    try {
        const response = await apiClient.get('/jobs');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Could not fetch jobs' };
    }
};

export const submitCompliance = async (jobId) => {
    try {
        const response = await apiClient.post(`/jobs/${jobId}/compliance`);
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to submit compliance' };
    }
};

export const createEstimate = async (jobId, amount, details) => {
    try {
        const response = await apiClient.post(`/jobs/${jobId}/estimate`, { amount, details });
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to create estimate' };
    }
};

export const createInvoice = async (jobId, amount) => {
    try {
        const response = await apiClient.post(`/jobs/${jobId}/invoice`, { amount });
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to create invoice' };
    }
};

export default {
    loginWorker,
    getAvailableLeads,
    acceptLead,
    getWorkerJobs,
    submitCompliance,
    createEstimate,
    createInvoice
};
