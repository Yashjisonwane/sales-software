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
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);

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
                    displayId: `LD-${l.id.slice(-4).toUpperCase()}`, // Clean Display ID
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
                    displayId: `JB-${j.id.slice(-4).toUpperCase()}`, // Clean Display ID
                    customerName: j.customer?.name || 'Customer',
                    category: j.categoryName || 'General',
                    date: j.scheduledDate ? new Date(j.scheduledDate).toLocaleDateString() : 'Today',
                    time: j.scheduledTime || 'TBD',
                    workerName: j.worker?.name || 'Assigned Worker'
                }));
                setJobs(flattenedJobs);
            }

            const profRes = await apiService.fetchAllProfessionals();
            if (profRes.success) {
                const workers = (profRes.data || []).map(w => ({
                    ...w,
                    location: w.city || w.address || '—', // Use city or address for display
                    status: w.status || (w.isAvailable ? 'Active' : 'Offline')
                }));
                setProfessionals(workers); 
            }

            const catRes = await apiService.fetchAllCategories();
            if (catRes.success) setCategories(catRes.data);

            const locRes = await apiService.fetchAllLocations();
            if (locRes.success) setLocations(locRes.data);

            const subRes = await apiService.fetchAllSubscriptions();
            if (subRes.success) setSubscriptionPlans(subRes.data);

            const statsRes = await apiService.fetchDashboardStats();
            if (statsRes.success) setDashboardStats(statsRes.data);
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

    const updateLead = async (leadId, updates) => {
        const res = await apiService.updateLead(leadId, updates);
        if (res.success) {
            showToast('Lead updated successfully!', 'success');
            loadInitialData();
        } else {
            showToast(res.error || 'Update failed', 'error');
        }
    };

    const deleteLead = async (leadId) => {
        const res = await apiService.deleteLead(leadId);
        if (res.success) {
            showToast('Lead deleted successfully!', 'success');
            loadInitialData();
        } else {
            showToast(res.error || 'Deletion failed', 'error');
        }
    };

    // --- JOBS & WORKFLOW ---
    const addJob = async (jobData) => {
        const res = await apiService.createJob(jobData);
        if (res.success) {
            showToast('Job created successfully!', 'success');
            loadInitialData();
            return res.data;
        } else {
            showToast(res.error || 'Failed to create job', 'error');
            return null;
        }
    };

    const startJob = (jobId) => {
        // Backend handles this via Photo Upload mapping automatically 
        showToast('Initiating Job in Backend...', 'info');
    };

    const completeJob = (jobId) => {
        // Handled via Invoice endpoint
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Completed' } : j));
    };

    const deleteJob = async (jobId) => {
        const res = await apiService.deleteJob(jobId);
        if (res.success) {
            showToast('Job record deleted', 'success');
            setJobs(prev => prev.filter(j => j.id !== jobId));
            loadInitialData();
        } else {
            showToast(res.error || 'Failed to delete job', 'error');
        }
    };

    const updateJob = async (jobId, updates) => {
        const res = await apiService.updateJob(jobId, updates);
        if (res.success) {
            showToast('Job record updated!', 'success');
            loadInitialData();
        } else {
            showToast(res.error || 'Update failed', 'error');
        }
    };

    const updateJobStatus = async (jobId, newStatus) => {
        const res = await apiService.updateJob(jobId, { status: newStatus });
        if (res.success) {
            showToast('Status changed', 'info');
            loadInitialData();
        }
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

    // --- PROFESSIONAL TRACKING & FLEET ---
    const updateProfessionalLocation = async (lat, lng) => {
        const res = await apiService.updateProfessionalLocation(lat, lng);
        if (res.success) {
            setProfessionals(prev => prev.map(p => p.id === currentUser?.id ? { ...p, lastLocation: { lat, lng } } : p));
            return res;
        }
        return res;
    };

    const updateProfessionalStatus = async (isAvailable) => {
        const res = await apiService.updateProfessionalStatus(isAvailable);
        if (res.success) {
            setProfessionals(prev => prev.map(p => p.id === currentUser?.id ? { ...p, isAvailable, onlineStatus: isAvailable ? 'Online' : 'Offline' } : p));
            return res;
        }
        return res;
    };

    const addProfessional = async (userData) => {
        const res = await apiService.createProfessional(userData);
        if (res.success) {
            showToast('Professional added successfully!', 'success');
            loadInitialData();
            return res.data;
        } else {
            showToast(res.error || 'Failed to add professional', 'error');
            return null;
        }
    };

    const editProfessional = async (id, userData) => {
        const res = await apiService.updateProfessional(id, userData);
        if (res.success) {
            showToast('Professional record updated', 'success');
            loadInitialData();
            return res.data;
        } else {
            showToast(res.error || 'Failed to update', 'error');
            return null;
        }
    };

    const removeProfessional = async (id) => {
        const res = await apiService.deleteProfessional(id);
        if (res.success) {
            showToast('Professional removed from database', 'success');
            loadInitialData();
            return true;
        } else {
            showToast(res.error || 'Deletion failed', 'error');
            return false;
        }
    };

    const toggleTrackingSetting = (enabled) => {
        showToast(`Tracking ${enabled ? 'Enabled' : 'Disabled'}`, 'info');
    };

    // --- CATEGORIES ---
    const addCategory = async (data) => {
        const res = await apiService.addCategory(data);
        if (res.success) {
            showToast('Category added successfully!', 'success');
            loadInitialData();
        } else {
            showToast(res.error, 'error');
        }
    };

    const editCategory = async (id, data) => {
        const res = await apiService.updateCategory(id, data);
        if (res.success) {
            showToast('Category updated!', 'success');
            loadInitialData();
        } else {
            showToast(res.error, 'error');
        }
    };

    const deleteCategory = async (id) => {
        const res = await apiService.deleteCategory(id);
        if (res.success) {
            showToast('Category deleted!', 'success');
            loadInitialData();
        } else {
            showToast(res.error, 'error');
        }
    };

    return (
        <MarketplaceContext.Provider value={{
            leads,
            professionals,
            addProfessional,
            editProfessional,
            removeProfessional,
            categories,
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
            addJob,
            deleteJob,
            updateJob,
            updateJobStatus,
            addNotification,
            markNotificationRead,
            addCategory,
            editCategory,
            deleteCategory,
            setCurrentUser,
            updateProfile,
            updateSubscription,
            deactivateAccount,
            locationLogs,
            dashboardStats,
            locations,
            subscriptionPlans,
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
