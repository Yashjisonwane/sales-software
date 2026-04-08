import apiClient from './apiClient';
import storage from './storage';

/**
 * SERVICE: Worker Authentication
 */
function loginErrorMessage(error) {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.code === 'ECONNABORTED') return 'Request timed out — is the backend running on port 4000?';
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        return 'Network error — same Wi‑Fi as PC? Firewall allow port 4000? Check apiConfig.js host.';
    }
    return error.message || 'Login failed';
}

const normalizeUser = (u = {}) => ({
    ...u,
    id: u?.id ?? null,
    name: u?.name ?? 'User',
    role: u?.role ?? 'WORKER',
    lat: u?.lat ?? u?.latitude ?? null,
    lng: u?.lng ?? u?.longitude ?? null,
});

const normalizeLead = (lead = {}) => ({
    ...lead,
    id: lead?.id ?? lead?.leadId ?? null,
    customerName: lead?.customerName ?? lead?.customer?.name ?? lead?.guestName ?? 'Customer',
    customerPhone: lead?.customerPhone ?? lead?.customer?.phone ?? lead?.guestPhone ?? null,
    categoryName: lead?.categoryName ?? lead?.category?.name ?? 'Service',
    customerLat: lead?.customerLat ?? lead?.latitude ?? null,
    customerLng: lead?.customerLng ?? lead?.longitude ?? null,
});

const normalizeJob = (job = {}) => ({
    ...job,
    id: job?.id ?? null,
    leadId: job?.leadId ?? job?.lead?.id ?? null,
    customerName: job?.customerName ?? job?.customer?.name ?? job?.lead?.customer?.name ?? 'Customer',
    categoryName: job?.categoryName ?? job?.lead?.category?.name ?? 'Service',
    customerLat: job?.customerLat ?? job?.latitude ?? job?.lead?.latitude ?? null,
    customerLng: job?.customerLng ?? job?.longitude ?? job?.lead?.longitude ?? null,
    chatId: job?.chatId ?? job?.chats?.id ?? null,
    invoice: job?.invoice ?? job?.invoices ?? null,
});

export const loginWorker = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.data.success) {
            await storage.setItem('userToken', response.data.data.token);
            await storage.setItem('userData', JSON.stringify(response.data.data.user));
        }
        return response.data;
    } catch (error) {
        return { success: false, message: loginErrorMessage(error) };
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
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
};

/**
 * SERVICE: Guest (no auth) — map browse + service request
 */
export const getJobsMap = async () => {
    try {
        const response = await apiClient.get('/jobs/map');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message || 'Map data failed' };
    }
};

export const getGuestNearby = async (latitude, longitude, radiusKm = 25) => {
    try {
        const response = await apiClient.get('/guest/nearby', {
            params: {
                latitude,
                longitude,
                radiusKm,
                include: 'workers,jobs'
            }
        });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message || 'Nearby failed' };
    }
};

export const submitGuestRequest = async (payload) => {
    try {
        const response = await apiClient.post('/guest/request', payload);
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Request failed'
        };
    }
};

export const trackGuestRequest = async (sessionToken) => {
    try {
        const response = await apiClient.get(`/guest/track/${sessionToken}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getGuestLiveTracking = async (sessionToken) => {
    try {
        const response = await apiClient.get(`/guest/live/${encodeURIComponent(sessionToken)}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/**
 * SERVICE: Leads Management
 */
export const getAvailableLeads = async () => {
    try {
        const response = await apiClient.get('/leads');
        const payload = response.data || {};
        return {
            ...payload,
            data: Array.isArray(payload.data) ? payload.data.map(normalizeLead) : [],
        };
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
        // Backend reads optional workerId from body; worker self-assign needs a JSON body (can be {}).
        const response = await apiClient.patch(`/leads/${leadId}/assign`, {});
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
        const payload = response.data || {};
        return {
            ...payload,
            data: Array.isArray(payload.data) ? payload.data.map(normalizeJob) : [],
        };
    } catch (error) {
        return { success: false, message: 'Could not fetch jobs' };
    }
};

/** Single job — photos are filtered server-side by JWT role (ADMIN / WORKER / GUEST). */
export const getJobById = async (jobIdOrJobNo) => {
    try {
        const response = await apiClient.get(`/jobs/${encodeURIComponent(jobIdOrJobNo)}`);
        const payload = response.data || {};
        return {
            ...payload,
            data: payload.data ? normalizeJob(payload.data) : null,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Could not fetch job',
        };
    }
};

export const getAllJobs = async () => {
    try {
        const response = await apiClient.get('/jobs');
        const payload = response.data || {};
        return {
            ...payload,
            data: Array.isArray(payload.data) ? payload.data.map(normalizeJob) : [],
        };
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

/** Admin: assign OPEN lead to nearest available worker (or guest preferredWorkerId). */
export const assignLeadNearest = async (leadId) => {
    try {
        const response = await apiClient.patch(`/leads/${leadId}/assign-nearest`);
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Assign nearest failed',
        };
    }
};

export const submitInspection = async (jobId, notes, triageAnswers) => {
    try {
        const response = await apiClient.post(`/jobs/${jobId}/inspection`, { notes, triageAnswers });
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to submit inspection',
        };
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
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to create estimate',
        };
    }
};

export const createInvoice = async (jobId, amount, extra = {}) => {
    try {
        const body = {
            amount: typeof amount === 'string' ? parseFloat(amount) : amount,
            ...extra,
        };
        const response = await apiClient.post(`/jobs/${jobId}/invoice`, body);
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to create invoice',
        };
    }
};

export const updateInvoiceStatus = async (invoiceId, status) => {
    try {
        const response = await apiClient.patch(`/jobs/invoices/${encodeURIComponent(invoiceId)}/status`, {
            status,
        });
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to update invoice status',
        };
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

export const uploadJobPhoto = async (jobId, photoUrl, type = 'SITE') => {
    try {
        const response = await apiClient.post(`/jobs/${encodeURIComponent(jobId)}/photos`, {
            url: photoUrl,
            type,
        });
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to upload photo',
        };
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

/** Admin: subscription plan upgrade queue */
export const getSubscriptionUpgradeRequests = async () => {
    try {
        const response = await apiClient.get('/leads/subscriptions/upgrade-requests');
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to load upgrade requests',
        };
    }
};

export const approveSubscriptionUpgrade = async (requestId) => {
    try {
        const response = await apiClient.put(
            `/leads/subscriptions/upgrade-requests/${encodeURIComponent(requestId)}/approve`
        );
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Approve failed',
        };
    }
};

export const rejectSubscriptionUpgrade = async (requestId) => {
    try {
        const response = await apiClient.put(
            `/leads/subscriptions/upgrade-requests/${encodeURIComponent(requestId)}/reject`
        );
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Reject failed',
        };
    }
};

/** Admin ops: tax/payroll snapshot, inventory from quotes, marketing activity */
export const getAdminTaxPayroll = async () => {
    try {
        const response = await apiClient.get('/admin/tax-payroll');
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to load tax & payroll',
        };
    }
};

export const getAdminInventorySnapshot = async () => {
    try {
        const response = await apiClient.get('/admin/inventory-snapshot');
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to load inventory',
        };
    }
};

export const getAdminMarketingFeed = async () => {
    try {
        const response = await apiClient.get('/admin/marketing-feed');
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to load activity',
        };
    }
};

/** Worker: own payouts & materials (scoped by JWT) */
export const getWorkerPayoutsSnapshot = async () => {
    try {
        const response = await apiClient.get('/worker/payouts-snapshot');
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to load payouts',
        };
    }
};

export const getWorkerMaterialsSnapshot = async () => {
    try {
        const response = await apiClient.get('/worker/materials-snapshot');
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to load materials',
        };
    }
};

export const getProfile = async () => {
    try {
        const response = await apiClient.get('/users/profile');
        const payload = response.data || {};
        return {
            ...payload,
            data: payload.data ? normalizeUser(payload.data) : null,
        };
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

export const getProfessionalsLocations = async () => {
    try {
        const response = await apiClient.get('/users/professionals-locations');
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Could not fetch professionals locations',
        };
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await apiClient.put('/users/profile', profileData);
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to update profile',
        };
    }
};

/** After profile updates, keep AsyncStorage userData in sync for navigation/UI. */
export const refreshLocalUserSnapshot = async () => {
    try {
        const res = await getProfile();
        if (res.success && res.data) {
            const u = res.data;
            await storage.setItem(
                'userData',
                JSON.stringify({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    phone: u.phone,
                })
            );
        }
        return res;
    } catch (error) {
        return { success: false, message: error.message };
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
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to update professional account',
        };
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

/** Job-linked chats (worker sees assigned jobs; admin sees all). */
export const getJobChats = async () => {
    try {
        const response = await apiClient.get('/chats');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message || 'Failed to load chats' };
    }
};

export const getJobChatMessages = async (chatId) => {
    try {
        const response = await apiClient.get(`/chats/${encodeURIComponent(chatId)}/messages`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message || 'Failed to load messages' };
    }
};

export const sendJobChatMessage = async (chatId, text) => {
    try {
        const response = await apiClient.post(`/chats/${encodeURIComponent(chatId)}/messages`, { text });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message || 'Failed to send' };
    }
};

export const getNotifications = async () => {
    try {
        const response = await apiClient.get('/notifications');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const markNotificationRead = async (id) => {
    try {
        const response = await apiClient.patch(`/notifications/${encodeURIComponent(id)}/read`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const clearNotifications = async () => {
    try {
        const response = await apiClient.delete('/notifications/clear');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getWorkerReviews = async () => {
    try {
        const response = await apiClient.get('/reviews');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getLeadById = async (leadId) => {
    try {
        const response = await apiClient.get(`/leads/${encodeURIComponent(leadId)}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const registerWorkerByInvite = async ({ token, name, phone, password }) => {
    try {
        const response = await apiClient.post('/auth/register-invited', { token, name, phone, password });
        if (response.data.success && response.data.data?.token) {
            await storage.setItem('userToken', response.data.data.token);
            await storage.setItem('userData', JSON.stringify(response.data.data.user));
        }
        return response.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message || 'Registration failed' };
    }
};

export default {
    loginWorker,
    registerUser,
    getAvailableLeads,
    getCategories,
    acceptLead,
    assignLeadNearest,
    getWorkerJobs,
    getJobById,
    submitCompliance,
    createEstimate,
    createInvoice,
    updateInvoiceStatus,
    getDashboardStats,
    getProfile,
    updateProfile,
    refreshLocalUserSnapshot,
    updateProfessional,
    getDirectMessages,
    sendDirectMessage,
    getJobChats,
    getJobChatMessages,
    sendJobChatMessage,
    getNotifications,
    markNotificationRead,
    clearNotifications,
    getWorkerReviews,
    getLeadById,
    registerWorkerByInvite,
    resetPassword,
    getGuestLiveTracking,
    uploadJobPhoto,
    assignJob,
    getJobHistory,
    getEstimates,
    getInvoices,
    submitInspection,
    getAdminTaxPayroll,
    getAdminInventorySnapshot,
    getAdminMarketingFeed,
    getSubscriptionUpgradeRequests,
    getWorkerPayoutsSnapshot,
    getWorkerMaterialsSnapshot,
};
