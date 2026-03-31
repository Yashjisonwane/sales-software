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

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
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

export const getCategories = async () => {
    try {
        const response = await apiClient.get('/leads/categories');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Could not fetch categories' };
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

export const getAllJobs = async () => {
    try {
        const response = await apiClient.get('/jobs');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Could not fetch all jobs' };
    }
};

export const getEstimates = async () => {
    try {
        const response = await apiClient.get('/jobs/estimates');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Could not fetch quotes' };
    }
};

export const getInvoices = async () => {
    try {
        const response = await apiClient.get('/jobs/invoices');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Could not fetch invoices' };
    }
};

export const assignLeadToWorker = async (leadId, workerId) => {
    try {
        const response = await apiClient.patch(`/leads/${leadId}/assign`, { workerId });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to assign lead' };
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

export const rescheduleJob = async (jobId, date, time) => {
    try {
        const response = await apiClient.patch(`/jobs/${jobId}`, { date, time });
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to reschedule job' };
    }
};

/**
 * SERVICE: User Management
 */
export const getDashboardStats = async () => {
    try {
        const response = await apiClient.get('/users/dashboard-stats');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to fetch dashboard stats' };
    }
};

export const getProfile = async () => {
    try {
        const response = await apiClient.get('/users/profile');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to fetch profile' };
    }
};

export const getProfessionals = async () => {
    try {
        const response = await apiClient.get('/users/workers');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Could not fetch professionals' };
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await apiClient.put('/users/profile', profileData);
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to update profile' };
    }
};

export default {
    loginWorker,
    registerUser,
    getAvailableLeads,
    getCategories,
    acceptLead,
    getWorkerJobs,
    submitCompliance,
    createEstimate,
    createInvoice,
    getDashboardStats,
    getProfile,
    updateProfile
};
