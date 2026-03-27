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
        return { success: false, message: 'Could not accept lead' };
    }
};

export default {
    loginWorker,
    getAvailableLeads,
    acceptLead
};
