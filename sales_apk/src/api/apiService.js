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
            await storage.setItem('userRole', response.data.data.user.role);
        }
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
};

/**
 * SERVICE: Password Reset
 */
export const resetPassword = async (email, newPassword) => {
    try {
        const response = await apiClient.post('/auth/reset-password', { email, newPassword });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
};

export const registerWithInvite = async (inviteData) => {
    try {
        const response = await apiClient.post('/auth/register-invited', inviteData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Invalid invite code' };
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

export const getJobsForMap = async () => {
    try {
        const response = await apiClient.get('/jobs/map');
        return response.data;
    } catch (error) {
        return { success: false, message: 'Could not fetch jobs for map' };
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

export const submitInspection = async (jobId, notes, triageAnswers) => {
    try {
        const response = await apiClient.post(`/jobs/${jobId}/inspection`, { notes, triageAnswers });
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to submit inspection' };
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

export const createEstimate = async (jobId, amount, details, materials, laborHours, measurements) => {
    try {
        const response = await apiClient.post(`/jobs/${jobId}/estimate`, { 
            amount, details, materials, laborHours, measurements 
        });
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

export const getJobHistory = async (jobId) => {
    try {
        const response = await apiClient.get(`/jobs/${jobId}/history`);
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to fetch job activity' };
    }
};

export const uploadJobPhoto = async (jobId, photoUrl) => {
    try {
        const response = await apiClient.post(`/jobs/${jobId}/photos`, { url: photoUrl });
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to upload photo' };
    }
};

/**
 * SERVICE: User Management
 */
export const assignJob = async (jobId, workerId) => {
    try {
        const response = await apiClient.patch(`/jobs/${jobId}`, { professionalId: workerId });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to assign job' };
    }
};

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

/**
 * SERVICE: Admin - Worker Management
 */
export const updateProfessional = async (workerId, updateData) => {
    try {
        const response = await apiClient.put(`/users/workers/${workerId}`, updateData);
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to update professional account' };
    }
};

/**
 * SERVICE: Messaging
 */
export const getDirectMessages = async (userId) => {
    try {
        const response = await apiClient.get(`/chats/direct/${userId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to load conversation' };
    }
};

export const sendDirectMessage = async (userId, text) => {
    try {
        const response = await apiClient.post(`/chats/direct/${userId}`, { text });
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to send message' };
    }
};

export const getJobChatMessages = async (chatId) => {
    try {
        const response = await apiClient.get(`/chats/${chatId}/messages`);
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to fetch job chat' };
    }
};

export const sendJobChatMessage = async (chatId, text) => {
    try {
        const response = await apiClient.post(`/chats/${chatId}/messages`, { text });
        return response.data;
    } catch (error) {
        return { success: false, message: 'Failed to send job message' };
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
    updateProfile,
    updateProfessional,
    getDirectMessages,
    sendDirectMessage,
    resetPassword,
    uploadJobPhoto,
    assignJob,
    getJobHistory,
    getEstimates,
    getInvoices,
    submitInspection,
    getJobsForMap,
    getJobChatMessages,
    sendJobChatMessage,
    registerWithInvite
};
