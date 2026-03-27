import React, { createContext, useContext, useState, useEffect } from 'react';
import * as apiService from '../services/apiService';

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
    // ─── AUTHENTICATION STATE ───
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ─── DATA STATES ───
    const [leads, setLeads] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [assignments, setAssignments] = useState([]); // Can be derived from leads in backend or kept for compatibility

    // ─── UI & MOCK STATES (Preserved for Admin Demo functionality) ───
    const [reviews, setReviews] = useState([]);
    const [locationLogs, setLocationLogs] = useState([]);
    const [earningsHistory, setEarningsHistory] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast] = useState(null);

    // --- TOASTS ---
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const addNotification = (notif) => {
        setNotifications(prev => [{ id: Date.now(), date: new Date().toISOString(), unread: true, ...notif }, ...prev]);
    };
    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    // --- AUTHENTICATION ACTIONS ---
    const login = async (email, password) => {
        const res = await apiService.loginAdmin(email, password);
        if (res.success) {
            localStorage.setItem('userToken', res.data.token);
            setCurrentUser(res.data.user);
            setIsAuthenticated(true);
            showToast('Login successful!', 'success');
            await loadInitialData();
            return true;
        } else {
            showToast(res.error || 'Login failed', 'error');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setLeads([]);
        setJobs([]);
    };

    // Auto-login check (Assuming valid token in local storage matches a session - Simplified for MVP)
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            // Ideally we'd hit a '/me' endpoint here to re-validate token and get user role
            // For now, we simulate success if token exists
            setIsAuthenticated(true);
            loadInitialData();
            // Just for UI purposes, mock the current user visually until backend provides `GET /me`
            setCurrentUser({ id: 'Admin1', name: 'Admin Account', role: 'ADMIN' });
        }
    }, []);

    // --- DATA FETCHING ---
    const loadInitialData = async () => {
        try {
            const leadsRes = await apiService.fetchAllLeads();
            if (leadsRes.success) {
                // Flatten the data for easier UI consumption
                const flattenedLeads = (leadsRes.data || []).map(l => ({
                    ...l,
                    customerName: l.customer?.name || 'Unknown Customer',
                    customerPhone: l.customer?.phone || '',
                    serviceCategory: l.category?.name || 'General Service',
                    dateRequested: l.createdAt
                }));
                setLeads(flattenedLeads);
            }

            const jobsRes = await apiService.fetchAllJobs();
            if (jobsRes.success) {
                // Flatten Jobs data for consume (Job -> lead -> customer)
                const flattenedJobs = (jobsRes.data || []).map(j => ({
                    ...j,
                    customerName: j.customer?.name || 'Customer',
                    category: j.categoryName || 'General',
                    date: j.scheduledDate ? new Date(j.scheduledDate).toLocaleDateString() : 'Today',
                    time: j.scheduledTime || 'TBD',
                    workerName: j.worker?.name || 'Assigned Worker'
                }));
                setJobs(flattenedJobs);
            }

            const profRes = await apiService.fetchAllProfessionals();
            if (profRes.success) setProfessionals(profRes.data);
        } catch (error) {
            console.error('Initial Data Load Error:', error);
            showToast('Failed to load live data', 'error');
        }
    };

    // --- LEADS ---
    const addLead = async (formData) => {
        // Backend now handles distribution strictly via API
        const res = await apiService.submitServiceRequest(formData);
        if (res.success) {
            showToast('Service request submitted successfully!', 'success');
            // Refresh leads
            loadInitialData();
            return res.data;
        } else {
            showToast(res.error, 'error');
            return null;
        }
    };

    const assignLead = async (leadId, professionalId) => {
        const res = await apiService.assignLeadToWorker(leadId, professionalId);
        if (res.success) {
            showToast('Lead Assigned successfully! Job created natively.', 'success');
            // Optimistically update
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'ASSIGNED' } : l));
            loadInitialData(); // Reload to fetch the newly created job
        } else {
            showToast(res.error || 'Failed to assign lead', 'error');
        }
    };

    const updateLead = (leadId, updates) => {
        // Mock fallback for UI states not yet in Database
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l));
    };

    const deleteLead = (leadId) => {
        // Mock fallback for UI states not yet in Database
        setLeads(prev => prev.filter(l => l.id !== leadId));
    };

    // --- JOBS & WORKFLOW ---
    const startJob = (jobId) => {
        // Backend handles this via Photo Upload mapping automatically 
        showToast('Initiating Job in Backend...', 'info');
    };

    const completeJob = (jobId) => {
        // Handled via Invoice endpoint
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Completed' } : j));
    };

    const deleteJob = (jobId) => {
        setJobs(prev => prev.filter(j => j.id !== jobId));
    };

    const updateJob = (jobId, updates) => {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updates } : j));
        showToast('Job updated locally', 'success');
    };

    const updateJobStatus = (jobId, newStatus) => {
        setJobs(prev => prev.map(l => l.id === jobId ? { ...l, status: newStatus } : l));
    };

    // --- ASSIGNMENT RESPONSES ---
    const respondToLead = async (assignmentId, decision) => {
        // Dummy placeholder until strictly implemented in worker views
        showToast(`Locally responded to assignment: ${decision}`, 'info');
    };

    const reassignLead = async (leadId) => {
        showToast('Local reassignment simulation active', 'info');
    };

    // --- PROFILES ---
    const updateProfile = (updates) => {
        setCurrentUser(prev => ({ ...prev, ...updates }));
    };

    const updateSubscription = (plan) => {
        setCurrentUser(prev => ({ ...prev, subscriptionPlan: plan }));
    };

    const deactivateAccount = () => {
        setCurrentUser(prev => ({ ...prev, status: 'Inactive' }));
    };

    // --- LIVE TRACKING & LOCATION LOGIC ---
    const updateProfessionalLocation = (proId, lat, lng) => {};
    const updateProfessionalStatus = (proId, status) => {};
    const toggleTrackingSetting = (proId, enabled) => {};

    return (
        <MarketplaceContext.Provider value={{
            leads,
            professionals,
            assignments,
            reviews,
            notifications,
            setNotifications,
            currentUser,
            earningsHistory,
            toast,
            showToast,
            addLead,
            updateLead,
            deleteLead,
            respondToLead,
            reassignLead,
            assignLead,
            jobs,
            startJob,
            completeJob,
            addJob: () => showToast('Job added directly is strictly disabled to prevent workflow bypassing.', 'error'),
            deleteJob,
            updateJob,
            updateJobStatus,
            addNotification,
            markNotificationRead,
            setCurrentUser,
            updateProfile,
            updateSubscription,
            deactivateAccount,
            locationLogs,
            updateProfessionalLocation,
            updateProfessionalStatus,
            toggleTrackingSetting,
            // Custom Auth Methods
            login,
            logout,
            isAuthenticated
        }}>
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = () => {
    const context = useContext(MarketplaceContext);
    if (!context) throw new Error('useMarketplace must be used within a MarketplaceProvider');
    return context;
};
