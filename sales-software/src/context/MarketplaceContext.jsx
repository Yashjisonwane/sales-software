import React, { createContext, useContext, useState, useEffect } from 'react';
import { leadsData, professionalsData, leadAssignments, servicesData, reviewsData } from '../data/models';
import { distributeNewLead } from '../services/leadService';

const MarketplaceContext = createContext();

// Persistence helpers
const parseJSON = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
};

export const MarketplaceProvider = ({ children }) => {
    const [leads, setLeads] = useState(leadsData);
    const [professionals, setProfessionals] = useState(professionalsData);
    const [assignments, setAssignments] = useState(leadAssignments);
    const [reviews, setReviews] = useState(reviewsData);

    // Attempt to load previously logged-in professional, default to John Doe
    const [currentUser, setCurrentUser] = useState(professionalsData[0]);

    // Live Tracking & Status State
    const [locationLogs, setLocationLogs] = useState([]);

    // Jobs State
    const [jobs, setJobs] = useState([
        { 
            id: 'JOB-1023', 
            customerName: 'Alice Johnson', 
            phone: '+1 555-010-9988', 
            category: 'Plumbing', 
            professionalName: 'John Doe', 
            professionalId: 'P001',
            status: 'In Progress', 
            date: '2026-03-24',
            time: '14:30',
            location: 'Springfield, IL',
            description: 'Fixing a leaky kitchen faucet and checking water pressure.',
            address: '123 Maple St, Springfield, IL 62704'
        },
        { 
            id: 'JOB-1024', 
            customerName: 'Robert Smith', 
            phone: '+1 555-012-3344', 
            category: 'Electrical', 
            professionalName: 'Jane Smith', 
            professionalId: 'P002',
            status: 'Scheduled', 
            date: '2026-03-26',
            time: '09:00',
            location: 'Lakeside, FL',
            description: 'Installing new LED ceiling fixtures in the living room.',
            address: '456 Oak Rd, Lakeside, FL 33815'
        }
    ]);

    // Earnings state
    const [earningsHistory, setEarningsHistory] = useState([
        { id: 'E001', leadId: 'L003', customer: 'Carol White', service: 'Cleaning', amount: 150, date: '2026-03-05', paymentStatus: 'Paid' },
        { id: 'E002', leadId: 'L001', customer: 'Alice Johnson', service: 'Plumbing', amount: 120, date: '2026-03-01', paymentStatus: 'Paid' },
    ]);

    // Toast state
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Notifications state
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'lead', title: 'New Lead Assigned', message: 'A new plumbing lead is available in Springfield.', date: new Date().toISOString(), unread: true },
    ]);

    // --- EFFECT HOOKS ---
    // Force inject dummy leads and ensure they are assigned to the current user
    useEffect(() => {
        if (!currentUser?.id) return;

        const dummyIds = ['L005', 'L006', 'L007', 'L008'];
        
        // Ensure assignments exist for current user
        setAssignments(prev => {
            const newAssignments = [...prev];
            let changed = false;

            dummyIds.forEach(id => {
                const hasAsgn = newAssignments.some(a => a.leadId === id && a.professionalId === currentUser.id);
                if (!hasAsgn) {
                    const template = leadAssignments.find(a => a.leadId === id) || {
                        status: id === 'L006' ? 'Accepted' : 'Sent',
                        assignedAt: new Date().toISOString()
                    };
                    newAssignments.push({
                        ...template,
                        id: `LA-AUTO-${id}-${currentUser.id}`,
                        leadId: id,
                        professionalId: currentUser.id
                    });
                    changed = true;
                }
            });

            return changed ? newAssignments : prev;
        });

        // Ensure dummy leads themselves exist in the leads array
        setLeads(prev => {
            const newLeads = [...prev];
            let changed = false;
            
            dummyIds.forEach(id => {
                const hasLead = newLeads.some(l => l.id === id);
                if (!hasLead) {
                    const template = leadsData.find(l => l.id === id);
                    if (template) {
                        newLeads.push(template);
                        changed = true;
                    }
                }
            });
            
            return changed ? newLeads : prev;
        });
    }, [currentUser?.id]);

    // --- LEADS ---
    const addLead = async (formData) => {
        const result = await distributeNewLead(formData);

        // Add lead to state regardless of whether professionals were found
        setLeads(prev => [result.lead, ...prev]);

        if (result.assignments && result.assignments.length > 0) {
            setAssignments(prev => [...result.assignments, ...prev]);
        }

        if (result.error) {
            // Show warning but lead is still created
            showToast(result.error, 'error');
        } else {
            showToast('Service request submitted successfully!', 'success');
        }

        // Notify matching pros
        if (result.assignments) {
            result.assignments.forEach(asgn => {
                if (asgn.professionalId === currentUser.id) {
                    addNotification({
                        type: 'lead',
                        title: 'New Lead Available!',
                        message: `A new ${result.lead.serviceCategory} lead from ${result.lead.customerName} is waiting for you.`,
                    });
                }
            });
        }

        return result.lead;
    };

    const updateLead = (leadId, updates) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l));
    };

    const deleteLead = (leadId) => {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        setAssignments(prev => prev.filter(a => a.leadId !== leadId));
    };

    // --- ASSIGNMENT & RESPONSES ---
    const respondToLead = (assignmentId, decision) => {
        setAssignments(prev => {
            const currentAssignment = prev.find(a => a.id === assignmentId);
            if (!currentAssignment) return prev;

            const updatedStatus = decision === 'accept' ? 'Accepted' : 'Rejected';
            
            // If accepted, lock the lead
            if (decision === 'accept') {
                updateLead(currentAssignment.leadId, { 
                    status: 'Accepted', 
                    assignedTo: currentAssignment.professionalId 
                });
                
                // Reject all other SENT/VIEWED assignments for this lead
                return prev.map(a => {
                    if (a.id === assignmentId) {
                        return { ...a, status: 'Accepted', responseAt: new Date().toISOString() };
                    }
                    if (a.leadId === currentAssignment.leadId && (a.status === 'Sent' || a.status === 'Viewed')) {
                        return { ...a, status: 'Rejected', responseAt: new Date().toISOString() };
                    }
                    return a;
                });
            } 
            
            // If rejected, remove from current user's view and find ANOTHER professional automatically
            if (decision === 'reject') {
                const lead = leads.find(l => l.id === currentAssignment.leadId);
                if (lead) {
                    // Find all professionals already involved
                    const pastProIds = prev.filter(a => a.leadId === currentAssignment.leadId).map(a => a.professionalId);
                    
                    // Find a new professional candidate
                    let availablePros = professionals.filter(p => 
                        p.category === lead.serviceCategory && 
                        !pastProIds.includes(p.id) &&
                        p.status === 'Active'
                    );

                    // If no one in same category is available, try any active professional
                    if (availablePros.length === 0) {
                        availablePros = professionals.filter(p => !pastProIds.includes(p.id) && p.status === 'Active');
                    }

                    if (availablePros.length > 0) {
                        // Prioritize same Zip Code for "nearby" logic
                        const nearbyPros = availablePros.filter(p => p.zipCode === lead.zipCode);
                        const candidates = nearbyPros.length > 0 ? nearbyPros : availablePros;
                        
                        const newPro = candidates[Math.floor(Math.random() * candidates.length)];
                        const newAssignment = {
                            id: `LA-AUTO-${Date.now()}-${newPro.id}`,
                            leadId: lead.id,
                            professionalId: newPro.id,
                            status: 'Sent',
                            assignedAt: new Date().toISOString(),
                            notificationsSent: { email: true, sms: true, app: true },
                            matchScore: 90
                        };
                        
                        // Add the new assignment AND REMOVE the current assignment from this user's view
                        return [newAssignment, ...prev.filter(a => a.id !== assignmentId)];
                    }
                }
                
                // If it fails to find another pro, just drop the assignment completely so it disappears for the user
                return prev.filter(a => a.id !== assignmentId);
            }

            // Default: just update the current assignment
            return prev.map(a => a.id === assignmentId 
                ? { ...a, status: updatedStatus, responseAt: new Date().toISOString() } 
                : a
            );
        });
    };

    const reassignLead = async (leadId) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;

        // Find all professionals who have already been assigned (and possibly rejected) this lead
        const pastAssignments = assignments.filter(a => a.leadId === leadId);
        const pastProIds = pastAssignments.map(a => a.professionalId);

        // Find a professional in the same category who hasn't been assigned yet, or fallback to any other pro
        let availablePros = professionals.filter(p => p.category === lead.serviceCategory && !pastProIds.includes(p.id));

        if (availablePros.length === 0) {
            // Fallback: Just string together another pro if all rejected for this demo
            availablePros = professionals.filter(p => !pastProIds.includes(p.id));
            if (availablePros.length === 0) {
                showToast('All professionals have already rejected this lead.', 'error');
                return;
            }
        }

        const newProId = availablePros[Math.floor(Math.random() * availablePros.length)].id;

        const newAssignment = {
            id: `LA${Date.now()}`,
            leadId,
            professionalId: newProId,
            status: 'Sent',
            assignedAt: new Date().toISOString(),
            notificationsSent: { email: true, sms: true, app: true },
            matchScore: 95
        };

        setAssignments(prev => [newAssignment, ...prev]);
        updateLead(lead.id, { status: 'New' }); // Reset status to New

        showToast('Lead reassigned to new professionals successfully!', 'success');
    };

    // --- JOBS & EARNINGS ---
    const updateJobStatus = (leadId, newStatus) => {
        setLeads(prev => prev.map(l => {
            if (l.id === leadId) {
                const updatedLead = { ...l, status: newStatus };

                if (newStatus === 'Completed') {
                    // Calculate amount (simulated)
                    const amount = 100 + Math.floor(Math.random() * 200);

                    setEarningsHistory(prevE => [
                        {
                            id: `E${Date.now()}`,
                            leadId: l.id,
                            customer: l.customerName,
                            service: l.serviceCategory,
                            amount,
                            date: new Date().toISOString().split('T')[0],
                            paymentStatus: 'Processing'
                        },
                        ...prevE
                    ]);

                    addNotification({
                        type: 'payment',
                        title: 'Payment Received',
                        message: `Payment of $${amount} confirmed for ${l.customerName}.`,
                    });
                }
                return updatedLead;
            }
            return l;
        }));
    };

    // --- NOTIFICATIONS ---
    const addNotification = (notif) => {
        setNotifications(prev => [
            { id: Date.now(), date: new Date().toISOString(), unread: true, ...notif },
            ...prev
        ]);
    };

    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const assignLead = (leadId, professionalId) => {
        updateLead(leadId, { status: 'Assigned', assignedTo: professionalId });

        const newAssignment = {
            id: `LA${Date.now()}`,
            leadId,
            professionalId,
            status: 'Accepted',
            assignedAt: new Date().toISOString()
        };
        setAssignments(prev => [newAssignment, ...prev]);
    };

    const startJob = (leadId) => {
        updateJobStatus(leadId, 'In Progress');
        showToast('Job started.', 'success');
    };

    const completeJob = (leadId) => {
        updateJobStatus(leadId, 'Completed');
        showToast('Job marked as completed.', 'success');
    };

    const addJob = (jobData) => {
        const pro = professionals.find(p => p.id === jobData.professionalId);
        const newJob = {
            ...jobData,
            id: `JOB-${1000 + jobs.length + 1}`,
            status: 'Scheduled',
            professionalName: pro ? pro.name : 'Unassigned'
        };
        setJobs(prev => [newJob, ...prev]);
        showToast('Job created successfully!', 'success');
    };



    const updateProfile = (updates) => {
        setCurrentUser(prev => ({ ...prev, ...updates }));
        setProfessionals(prev => prev.map(p => p.id === currentUser.id ? { ...p, ...updates } : p));
        showToast('Profile updated successfully', 'success');
    };

    const updateSubscription = (plan) => {
        setCurrentUser(prev => ({ ...prev, subscriptionPlan: plan }));
        setProfessionals(prev => prev.map(p => p.id === currentUser.id ? { ...p, subscriptionPlan: plan } : p));
        showToast(`Plan upgraded to ${plan}`, 'success');
    };

    const deactivateAccount = () => {
        setProfessionals(prev => prev.map(p => p.id === currentUser.id ? { ...p, status: 'Inactive' } : p));
        setCurrentUser(prev => ({ ...prev, status: 'Inactive' }));
        showToast('Account deactivated. Contact support for recovery.', 'info');
    };

    // --- LIVE TRACKING & LOCATION LOGIC ---
    const updateProfessionalLocation = (proId, lat, lng) => {
        const timestamp = new Date().toISOString();
        
        setProfessionals(prev => prev.map(p => 
            p.id === proId ? { 
                ...p, 
                lastLocation: { lat, lng }, 
                lastUpdate: timestamp 
            } : p
        ));

        // Update current user if applicable
        if (currentUser?.id === proId) {
            setCurrentUser(prev => ({ 
                ...prev, 
                lastLocation: { lat, lng }, 
                lastUpdate: timestamp 
            }));
        }

        // Add to history logs
        setLocationLogs(prev => [
            { id: `LOG-${Date.now()}-${proId}`, proId, lat, lng, timestamp },
            ...prev.slice(0, 1000) // Keep last 1000 logs
        ]);
    };

    const updateProfessionalStatus = (proId, status) => {
        setProfessionals(prev => prev.map(p => 
            p.id === proId ? { ...p, onlineStatus: status } : p
        ));
        
        if (currentUser?.id === proId) {
            setCurrentUser(prev => ({ ...prev, onlineStatus: status }));
        }
    };

    const toggleTrackingSetting = (proId, enabled) => {
        setProfessionals(prev => prev.map(p => 
            p.id === proId ? { ...p, trackingEnabled: enabled } : p
        ));
        
        if (currentUser?.id === proId) {
            setCurrentUser(prev => ({ ...prev, trackingEnabled: enabled }));
        }
    };

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
            updateJobStatus,
            addNotification,
            markNotificationRead,
            setCurrentUser,
            updateProfile,
            updateSubscription,
            deactivateAccount,
            assignLead,
            startJob,
            completeJob,
            locationLogs,
            updateProfessionalLocation,
            updateProfessionalStatus,
            toggleTrackingSetting,
            jobs,
            addJob
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
