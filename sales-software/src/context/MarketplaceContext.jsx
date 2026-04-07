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
    const [professionalLocations, setProfessionalLocations] = useState([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [professionalRequests, setProfessionalRequests] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [upgradeRequests, setUpgradeRequests] = useState([]);

    // ─── UI & MOCK STATES ───
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ averageRating: 0, distribution: [] });
    const [chats, setChats] = useState([]);
    const [activeChatMessages, setActiveChatMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast] = useState(null);

    // --- UTILITIES (Defined first to avoid TDZ) ---
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const addNotification = async (notif) => {
        setNotifications(prev => [{ id: Date.now(), createdAt: new Date().toISOString(), isRead: false, ...notif }, ...prev]);
    };

    const markNotificationRead = async (id) => {
        const res = await apiService.markNotificationRead(id);
        if (res.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        }
    };

    const clearNotifications = async () => {
        const res = await apiService.clearNotifications();
        if (res.success) {
            setNotifications([]);
            showToast('Notifications cleared', 'info');
        }
    };

    // --- DATA FETCHING (Depends on showToast) ---
    const loadInitialData = useCallback(async () => {
        try {
            const leadsRes = await apiService.fetchAllLeads();
            if (leadsRes.success) {
                const flattenedLeads = (leadsRes.data || []).map(l => ({
                    ...l,
                    displayId: l.leadNo || `LD-${l.id.slice(-4).toUpperCase()}`,
                    customerName: l.customerName || l.guestName || l.customer?.name || 'Unknown Customer',
                    customerPhone: l.customerPhone || l.guestPhone || l.customer?.phone || '—',
                    customerEmail: l.customerEmail || l.guestEmail || l.customer?.email || '—',
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
                const flattenedJobs = (jobsRes.data || []).map(j => {
                    const relatedLead = (leadsRes.data || []).find(l => l.id === j.leadId);
                    return {
                        ...j,
                        displayId: j.jobNo || `JB-${j.id.slice(-4).toUpperCase()}`,
                        customerName: j.customer?.name || relatedLead?.customer?.name || relatedLead?.customerName || 'Customer',
                        phone: j.customer?.phone || j.customerPhone || relatedLead?.customer?.phone || relatedLead?.phone || '',
                        category: j.categoryName || relatedLead?.category?.name || 'General',
                        date: j.scheduledDate ? new Date(j.scheduledDate).toLocaleDateString() : 'Today',
                        time: j.scheduledTime || 'TBD',
                        workerName: j.worker?.name || 'Assigned Worker',
                        professionalName: j.worker?.name || 'Assigned Worker'
                    };
                });
                setJobs(flattenedJobs);

                const mappedAssignments = flattenedJobs.map(j => ({
                    id: j.id,
                    professionalId: j.workerId,
                    leadId: j.leadId,
                    status: j.status === 'SCHEDULED' ? 'Sent' : j.status,
                    date: j.createdAt
                }));
                setAssignments(mappedAssignments);
            }

            const profRes = await apiService.fetchAllProfessionals();
            if (profRes.success) {
                const workers = (profRes.data || []).map(w => ({
                    ...w,
                    location: w.city || w.address || '—',
                    trackingEnabled: !!(w.trackingEnabled ?? w.isTrackingEnabled),
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
                const user = {
                    ...profileRes.data,
                    trackingEnabled: !!(profileRes.data?.trackingEnabled ?? profileRes.data?.isTrackingEnabled),
                };
                setCurrentUser(user);
                
                if (user.role === 'ADMIN') {
                    const statsRes = await apiService.fetchDashboardStats();
                    if (statsRes.success) setDashboardStats(statsRes.data);

                    const requestsRes = await apiService.fetchAllProfessionalRequests();
                    if (requestsRes.success) setProfessionalRequests(requestsRes.data);

                    const upgradeRes = await apiService.fetchSubscriptionUpgradeRequests();
                    if (upgradeRes.success) setUpgradeRequests(upgradeRes.data);

                    const liveLocRes = await apiService.fetchProfessionalsLocations();
                    if (liveLocRes.success) setProfessionalLocations(liveLocRes.data || []);
                }

                const notifRes = await apiService.fetchNotifications();
                if (notifRes.success) setNotifications(notifRes.data);

                if (user.role === 'WORKER') {
                    const chatsRes = await apiService.fetchAllChats();
                    if (chatsRes.success) setChats(chatsRes.data);

                    const revRes = await apiService.fetchAllReviews();
                    if (revRes.success && revRes.data) {
                        const payload = revRes.data;
                        const list = Array.isArray(payload.data) ? payload.data : [];
                        setReviews(
                            list.map((r) => ({
                                ...r,
                                customerName: r.customerName || r.author || '',
                                serviceName: r.serviceName || r.serviceCategory || '',
                                locationName: r.locationName || r.location || '',
                            }))
                        );
                        setReviewStats({
                            averageRating: payload.averageRating ?? 0,
                            distribution: payload.distribution || [],
                        });
                    }
                }
            }
        } catch (error) {
            console.error('[MARKETPLACE] Initial Data Load Error:', error);
        }
    }, [showToast]);

    // --- AUTH ACTIONS (Depends on loadInitialData and showToast) ---
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
        showToast('Logged out', 'info');
    };

    // Auto-login check
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
                    localStorage.removeItem('userToken');
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                }
            } else {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, [loadInitialData]);

    // --- LEADS ---
    const addLead = async (formData) => {
        const res = await apiService.submitServiceRequest(formData);
        if (res.success) {
            showToast('Service request submitted successfully!', 'success');
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
            showToast(res.message || 'Lead assigned successfully!', 'success');
            await loadInitialData();
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

    // --- JOBS ---
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

    const deleteJob = async (jobId) => {
        const res = await apiService.deleteJob(jobId);
        if (res.success) {
            showToast('Job record deleted', 'success');
            loadInitialData();
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

    const startJob = async (jobId) => {
        const res = await apiService.updateJob(jobId, { status: 'IN_PROGRESS' });
        if (res.success) {
            showToast('Job started!', 'success');
            loadInitialData();
            return true;
        }
        return false;
    };

    const completeJob = async (jobId) => {
        const res = await apiService.updateJob(jobId, { status: 'COMPLETED' });
        if (res.success) {
            showToast('Job completed!', 'success');
            loadInitialData();
            return true;
        }
        return false;
    };

    const fetchChatMessages = async (chatId) => {
        setActiveChatMessages([]);
        const res = await apiService.fetchChatMessages(chatId);
        if (res.success) {
            setActiveChatMessages(res.data);
            return res.data;
        }
        return [];
    };

    const fetchChatThreadByJobId = async (jobId) => {
        setActiveChatMessages([]);
        const res = await apiService.fetchMessagesByRequest(jobId);
        if (res.success && res.data?.messages) {
            const mapped = res.data.messages.map((m) => ({
                id: m.id,
                text: m.message ?? m.text,
                isGuest: m.senderType === 'customer',
                created_at: m.timestamp,
                senderType: m.senderType,
            }));
            setActiveChatMessages(mapped);
            return res.data;
        }
        return null;
    };

    const appendIncomingChatMessage = useCallback((msg) => {
        setActiveChatMessages((prev) => (prev.some((p) => p.id === msg.id) ? prev : [...prev, msg]));
    }, []);

    const sendChatMessage = async (chatId, text) => {
        const res = await apiService.sendChatMessage(chatId, text);
        if (res.success) {
            setActiveChatMessages((prev) => (prev.some((p) => p.id === res.data?.id) ? prev : [...prev, res.data]));
            return true;
        }
        return false;
    };

    // --- PROFESSIONALS ---
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
            showToast('Professional removed', 'success');
            loadInitialData();
            return true;
        }
    };

    const approveProfessionalRequest = async (id) => {
        const res = await apiService.approveProfessionalRequest(id);
        if (res.success) {
            showToast('Request Approved!', 'success');
            loadInitialData();
            return res.data;
        }
    };

    const rejectProfessionalRequest = async (id) => {
        const res = await apiService.rejectProfessionalRequest(id);
        if (res.success) {
            showToast('Request Deleted', 'info');
            loadInitialData();
            return true;
        }
    };

    const updateSubscription = async (planName) => {
        const res = await apiService.enrollInSubscription({ 
            professionalId: currentUser?.id, 
            planName: planName 
        });
        if (res.success) {
            showToast(`Upgraded to ${planName}!`, 'success');
            loadInitialData();
            return true;
        }
    };

    const updateProfessionalStatus = async (isAvailable) => {
        const res = await apiService.updateProfessionalStatus(isAvailable);
        if (res.success) {
            setCurrentUser(prev => ({ ...prev, isAvailable }));
            showToast(`Status set to ${isAvailable ? 'Online' : 'Offline'}`, 'info');
            return res;
        }
    };

    const toggleTrackingSetting = async (userId, enabled) => {
        const res = await apiService.updateProfessionalTracking(enabled);
        if (res.success) {
            setCurrentUser(prev => ({ ...prev, trackingEnabled: enabled, isTrackingEnabled: enabled }));
        }
    };

    const updateProfessionalLocation = async (lat, lng) => {
        const res = await apiService.updateProfessionalLocation(lat, lng);
        if (res.success) {
            setCurrentUser(prev => prev ? ({ ...prev, lat, lng }) : prev);
        }
        return res;
    };

    const refreshProfessionalLocations = useCallback(async () => {
        const res = await apiService.fetchProfessionalsLocations();
        if (res.success) {
            setProfessionalLocations(res.data || []);
            return res.data || [];
        }
        return [];
    }, []);

    const patchProfessionalLocationRealtime = useCallback((payload) => {
        if (!payload?.professionalId) return;
        setProfessionalLocations((prev) => {
            const exists = prev.some((item) => item.id === payload.professionalId);
            if (!exists) {
                return [
                    ...prev,
                    {
                        id: payload.professionalId,
                        name: 'Professional',
                        lat: payload.lat,
                        lng: payload.lng,
                        updatedAt: payload.updatedAt || new Date().toISOString(),
                        trackingEnabled: payload.trackingEnabled ?? true,
                        onlineStatus: 'Online',
                        currentJob: null,
                    }
                ];
            }
            return prev.map((item) =>
                item.id === payload.professionalId
                    ? {
                        ...item,
                        lat: payload.lat,
                        lng: payload.lng,
                        updatedAt: payload.updatedAt || new Date().toISOString(),
                        trackingEnabled: payload.trackingEnabled ?? item.trackingEnabled,
                    }
                    : item
            );
        });
    }, []);

    // --- CATEGORIES ---
    const addCategory = async (data) => {
        const res = await apiService.createCategory(data);
        if (res.success) {
            showToast('Category added successfully!', 'success');
            loadInitialData();
        }
    };

    const editCategory = async (id, data) => {
        const res = await apiService.updateCategory(id, data);
        if (res.success) {
            showToast('Category updated!', 'success');
            loadInitialData();
        }
    };

    const deleteCategory = async (id) => {
        const res = await apiService.deleteCategory(id);
        if (res.success) {
            showToast('Category deleted!', 'success');
            loadInitialData();
        }
    };

    const addSubscriptionPlan = async (data) => {
        const res = await apiService.createSubscriptionPlan(data);
        if (res.success) {
            showToast('Plan added!', 'success');
            loadInitialData();
        }
    };

    const editSubscriptionPlan = async (id, data) => {
        const res = await apiService.updateSubscriptionPlan(id, data);
        if (res.success) {
            showToast('Plan updated!', 'success');
            loadInitialData();
        }
    };

    const deleteSubscriptionPlan = async (id) => {
        const res = await apiService.deleteSubscriptionPlan(id);
        if (res.success) {
            showToast('Plan deleted!', 'success');
            loadInitialData();
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
            reviewStats,
            chats,
            activeChatMessages,
            fetchChatMessages,
            fetchChatThreadByJobId,
            appendIncomingChatMessage,
            sendChatMessage,
            notifications,
            setNotifications,
            currentUser,
            toast,
            showToast,
            addLead,
            updateLead,
            deleteLead,
            respondToLead,
            assignLead,
            jobs,
            addJob,
            deleteJob,
            updateJob,
            updateJobStatus,
            markNotificationRead,
            clearNotifications,
            addCategory,
            editCategory,
            deleteCategory,
            setCurrentUser,
            updateSubscription,
            dashboardStats,
            locations,
            professionalLocations,
            subscriptionPlans,
            updateProfessionalLocation,
            refreshProfessionalLocations,
            patchProfessionalLocationRealtime,
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
                return false;
            },
            rejectUpgradeRequest: async (id) => {
                const res = await apiService.rejectSubscriptionUpgrade(id);
                if (res.success) {
                    showToast('Upgrade rejected', 'info');
                    loadInitialData();
                    return true;
                }
                return false;
            },
            refreshData: loadInitialData,
            startJob,
            completeJob,
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
