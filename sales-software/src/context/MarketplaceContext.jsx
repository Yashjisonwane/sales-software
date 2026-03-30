import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as apiService from '../services/apiService';

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
    // ─── AUTHENTICATION STATE ───
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null); // 'null' means loading, 'false' means logged out, 'true' means logged in

    // ─── DATA STATES ───
    const [leads, setLeads] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [professionalRequests, setProfessionalRequests] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [upgradeRequests, setUpgradeRequests] = useState([]);

    // ─── UI & MOCK STATES (Preserved for Admin Demo functionality) ───
    const [reviews, setReviews] = useState([]);
    const [locationLogs, setLocationLogs] = useState([]);
    const [earningsHistory, setEarningsHistory] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast] = useState(null);

    // --- TOASTS ---
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const addNotification = (notif) => {
        setNotifications(prev => [{ id: Date.now(), date: new Date().toISOString(), unread: true, ...notif }, ...prev]);
    };
    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    // --- AUTHENTICATION ACTIONS ---
    const login = async (email, password) => {
        const res = await apiService.loginUser(email, password);
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

    // Auto-login check (Fetch real user profile from token)
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('userToken');
            if (token) {
                const res = await apiService.fetchUserProfile();
                if (res.success) {
                    setIsAuthenticated(true);
                    setCurrentUser(res.data);
                    await loadInitialData();
                } else {
                    // Token invalid (User not found in reset DB) or expired
                    localStorage.removeItem('userToken');
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                    showToast('Session invalid. Please login again.', 'error');
                }
            } else {
                setIsAuthenticated(false); // No token, definitely not authenticated
            }
        };
        checkAuth();
    }, []);

    // --- DATA FETCHING ---
    const loadInitialData = useCallback(async () => {
        try {
            const leadsRes = await apiService.fetchAllLeads();
            if (leadsRes.success) {
                // Flatten the data for easier UI consumption
                const flattenedLeads = (leadsRes.data || []).map(l => ({
                    ...l,
                    displayId: l.leadNo || `LD-${l.id.slice(-4).toUpperCase()}`, // Clean Display ID
                    customerName: l.customer?.name || 'Unknown Customer',
                    customerPhone: l.customer?.phone || '',
                    customerEmail: l.customer?.email || '',
                    serviceCategory: l.category?.name || 'General Service',
                    servicePlan: l.servicePlan || 'Basic',
                    description: l.description || '',
                    preferredDate: l.preferredDate || '',
                    dateRequested: l.createdAt
                }));
                setLeads(flattenedLeads);
            }

            const jobsRes = await apiService.fetchAllJobs();
            if (jobsRes.success) {
                // Flatten Jobs data for consume (Job -> lead -> customer)
                const flattenedJobs = (jobsRes.data || []).map(j => ({
                    ...j,
                    displayId: j.jobNo || `JB-${j.id.slice(-4).toUpperCase()}`, // Clean Display ID
                    customerName: j.customer?.name || 'Customer',
                    category: j.categoryName || 'General',
                    date: j.scheduledDate ? new Date(j.scheduledDate).toLocaleDateString() : 'Today',
                    time: j.scheduledTime || 'TBD',
                    workerName: j.worker?.name || 'Assigned Worker',
                    professionalName: j.worker?.name || 'Assigned Worker'
                }));
                setJobs(flattenedJobs);

                // --- NEW: Populate Assignments for Professional Dashboard from Jobs ---
                const mappedAssignments = flattenedJobs.map(j => ({
                    id: j.id,
                    professionalId: j.workerId,
                    leadId: j.leadId,
                    status: j.status === 'SCHEDULED' ? 'Sent' : j.status, // Map SCHEDULED to 'Sent' for invitation feel
                    date: j.createdAt
                }));
                setAssignments(mappedAssignments);
            }

            const profRes = await apiService.fetchAllProfessionals();
            if (profRes.success) {
                const workers = (profRes.data || []).map(w => ({
                    ...w,
                    address: w.address || '',
                    city: w.city || '',
                    pincode: w.pincode || '',
                    location: w.city || w.address || '—', // Use city or address for display
                    status: w.status ? w.status : (w.isAvailable ? 'Active' : 'Offline')
                }));
                setProfessionals(workers); 
            }

            const catRes = await apiService.fetchAllCategories();
            if (catRes.success) setCategories(catRes.data);

            const locRes = await apiService.fetchAllLocations();
            if (locRes.success) setLocations(locRes.data);

            const subRes = await apiService.fetchAllSubscriptions();
            if (subRes.success) setSubscriptionPlans(subRes.data);

            const profileRes = await apiService.fetchUserProfile();
            if (profileRes.success) {
                const user = profileRes.data;
                setCurrentUser(user);
                
                // --- ADMIN-ONLY DATA ---
                if (user.role === 'ADMIN') {
                    const statsRes = await apiService.fetchDashboardStats();
                    if (statsRes.success) setDashboardStats(statsRes.data);

                    const requestsRes = await apiService.fetchAllProfessionalRequests();
                    if (requestsRes.success) setProfessionalRequests(requestsRes.data);

                    const upgradeRes = await apiService.fetchSubscriptionUpgradeRequests();
                    if (upgradeRes.success) setUpgradeRequests(upgradeRes.data);
                }
            }
        } catch (error) {
            console.error('Initial Data Load Error:', error);
            // Non-critical: only notify if it wasn't a permission error (403/401)
            if (!error.message?.includes('403') && !error.message?.includes('401')) {
                showToast('Failed to load live data', 'error');
            }
        }
    }, [showToast]);

    // --- SUBSCRIPTION PLANS ---
    const addSubscriptionPlan = async (planData) => {
        const res = await apiService.createSubscriptionPlan(planData);
        if (res.success) {
            showToast('New plan created!', 'success');
            loadInitialData();
            return res.data;
        } else {
            showToast(res.error, 'error');
            return null;
        }
    };

    const editSubscriptionPlan = async (id, planData) => {
        const res = await apiService.updateSubscriptionPlan(id, planData);
        if (res.success) {
            showToast('Plan updated successfully', 'success');
            loadInitialData();
            return res.data;
        } else {
            showToast(res.error, 'error');
            return null;
        }
    };

    const deleteSubscriptionPlan = async (id) => {
        const res = await apiService.deleteSubscriptionPlan(id);
        if (res.success) {
            showToast('Plan deleted', 'success');
            loadInitialData();
            return true;
        } else {
            showToast(res.error, 'error');
            return false;
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
        const mappedStatus = decision === 'accept' ? 'ACCEPTED' : (decision === 'reject' ? 'REJECTED' : decision);
        const res = await apiService.updateJob(assignmentId, { status: mappedStatus.toUpperCase() });
        if (res.success) {
            showToast(`Lead ${decision === 'accept' ? 'Accepted' : 'Rejected'}!`, 'success');
            loadInitialData();
            return true;
        } else {
            showToast(res.error || 'Action failed', 'error');
            return false;
        }
    };

    const reassignLead = async (leadId) => {
        showToast('Local reassignment simulation active', 'info');
    };

    // --- PROFILES ---
    const updateProfile = async (updates) => {
        const res = await apiService.updateUserProfile(updates);
        if (res.success) {
            setCurrentUser(res.data);
            showToast('Profile updated!', 'success');
            return true;
        } else {
            showToast(res.error || 'Profile update failed', 'error');
            return false;
        }
    };

    const updateSubscription = async (planName) => {
        const res = await apiService.enrollInSubscription({ 
            professionalId: currentUser?.id, 
            planName: planName 
        });
        if (res.success) {
            showToast(res.message || `Upgraded to ${planName}!`, 'success');
            loadInitialData(); // This will refresh the user profile with the new plan
            return true;
        } else {
            showToast(res.error || 'Upgrade failed', 'error');
            return false;
        }
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

    const approveProfessionalRequest = async (id) => {
        const res = await apiService.approveProfessionalRequest(id);
        if (res.success) {
            showToast('Request Approved! Password generated.', 'success');
            loadInitialData();
            return res.data; // Includes generatedPassword
        } else {
            showToast(res.error || 'Approval failed', 'error');
            return null;
        }
    };

    const rejectProfessionalRequest = async (id) => {
        const res = await apiService.rejectProfessionalRequest(id);
        if (res.success) {
            showToast('Request Deleted', 'info');
            loadInitialData();
            return true;
        } else {
            showToast(res.error || 'Rejection failed', 'error');
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
            addSubscriptionPlan,
            editSubscriptionPlan,
            deleteSubscriptionPlan,
            professionalRequests,
            approveProfessionalRequest,
            rejectProfessionalRequest,
            upgradeRequests,
            approveUpgradeRequest: async (id) => {
                const res = await apiService.approveSubscriptionUpgrade(id);
                if (res.success) {
                    showToast('Upgrade approved!', 'success');
                    loadInitialData();
                    return true;
                }
                showToast(res.error || 'Approval failed', 'error');
                return false;
            },
            rejectUpgradeRequest: async (id) => {
                const res = await apiService.rejectSubscriptionUpgrade(id);
                if (res.success) {
                    showToast('Upgrade rejected', 'info');
                    loadInitialData();
                    return true;
                }
                showToast(res.error || 'Rejection failed', 'error');
                return false;
            },
            refreshData: loadInitialData, // Exporting refresh function
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
