import apiClient from './apiClient';
import storage from './storage';

/**
 * SERVICE: Worker Authentication
 */
export const loginWorker = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.data.success) {
            await storage.setItem('userToken', response.data.token);
            await storage.setItem('userData', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
};

/**
 * SERVICE: Fetch Available Leads for Worker
 */
export const getAvailableLeads = async () => {
    try {
        const response = await apiClient.get('/leads');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to fetch leads' };
    }
};

/**
 * SERVICE: Accept a Lead (Converts to Job)
 */
export const acceptLead = async (leadId) => {
    try {
        const response = await apiClient.patch(`/leads/${leadId}/assign`, {
            // Worker is identified by token in header
        });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to accept lead' };
    }
};

/**
 * SERVICE: Update Job Workflow (Photos, Inspection, etc.)
 * Used by the worker app during the 5-step process
 */
export const updateJobStatus = async (jobId, stepData, stepType) => {
    // stepType: 'photos', 'inspection', 'estimate', etc.
    try {
        const response = await apiClient.post(`/jobs/${jobId}/${stepType}`, stepData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
};

export default {
    loginWorker,
    getAvailableLeads,
    acceptLead,
    updateJobStatus
};
