// import React, { useEffect, useRef, useState } from 'react';
// import { useMarketplace } from '../../context/MarketplaceContext';
// import LeadTable from '../../components/professional/LeadTable';
// import LeadDetailModal from '../../components/professional/LeadDetailModal';
// import { Search, Filter, ChevronRight } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';
// import { getSocketOrigin } from '../../services/apiClient';

// const Leads = () => {
//     const { leads, assignments, currentUser, respondToLead, showToast, startJob, completeJob } = useMarketplace();
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('All');
//     const navigate = useNavigate();

//     // Modal state
//     const [selectedLead, setSelectedLead] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [activeTrackingJobId, setActiveTrackingJobId] = useState(null);
//     const trackerRef = useRef({
//         socket: null,
//         watchId: null,
//         lastEmitAt: 0,
//         activeJobId: null,
//         arrivedNotifiedForJob: null
//     });

//     const getLeadDestination = (lead) => {
//         const lat = Number(lead?.latitude);
//         const lng = Number(lead?.longitude);
//         if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
//         return { lat, lng };
//     };

//     const haversineKm = (lat1, lon1, lat2, lon2) => {
//         const toRad = (x) => (x * Math.PI) / 180;
//         const R = 6371;
//         const dLat = toRad(lat2 - lat1);
//         const dLon = toRad(lon2 - lon1);
//         const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
//         return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     };

//     useEffect(() => {
//         const token = localStorage.getItem('userToken');
//         if (!token || !currentUser?.id) return;
//         const socket = io(getSocketOrigin(), {
//             auth: { token },
//             transports: ['websocket', 'polling']
//         });
//         trackerRef.current.socket = socket;
//         return () => {
//             if (trackerRef.current.watchId != null) {
//                 navigator.geolocation.clearWatch(trackerRef.current.watchId);
//                 trackerRef.current.watchId = null;
//             }
//             trackerRef.current.socket?.disconnect();
//             trackerRef.current.socket = null;
//         };
//     }, [currentUser?.id]);

//     const stopLiveTracking = () => {
//         if (trackerRef.current.watchId != null) {
//             navigator.geolocation.clearWatch(trackerRef.current.watchId);
//             trackerRef.current.watchId = null;
//         }
//         trackerRef.current.activeJobId = null;
//         trackerRef.current.arrivedNotifiedForJob = null;
//         setActiveTrackingJobId(null);
//         showToast('Live tracking stopped', 'info');
//     };

//     const startLiveTracking = (jobId, lead) => {
//         if (!navigator.geolocation) {
//             showToast('Geolocation not supported on this browser', 'error');
//             return;
//         }
//         const destination = getLeadDestination(lead);
//         trackerRef.current.activeJobId = jobId;
//         trackerRef.current.arrivedNotifiedForJob = null;
//         setActiveTrackingJobId(jobId);
//         if (trackerRef.current.watchId != null) {
//             navigator.geolocation.clearWatch(trackerRef.current.watchId);
//             trackerRef.current.watchId = null;
//         }
//         trackerRef.current.watchId = navigator.geolocation.watchPosition(
//             (position) => {
//                 const lat = position.coords.latitude;
//                 const lng = position.coords.longitude;
//                 const now = Date.now();
//                 if (now - trackerRef.current.lastEmitAt < 4000) return;
//                 trackerRef.current.lastEmitAt = now;
//                 trackerRef.current.socket?.emit('location_update', { lat, lng, jobId });
//                 if (destination) {
//                     const distanceKm = haversineKm(lat, lng, destination.lat, destination.lng);
//                     if (distanceKm <= 0.1 && trackerRef.current.arrivedNotifiedForJob !== jobId) {
//                         trackerRef.current.arrivedNotifiedForJob = jobId;
//                         trackerRef.current.socket?.emit('professional_arrived', { jobId });
//                     }
//                 }
//             },
//             () => showToast('Unable to read live location', 'error'),
//             { enableHighAccuracy: true, timeout: 12000, maximumAge: 3000 }
//         );
//     };

//     const openNavigation = (lead) => {
//         const destination = getLeadDestination(lead);
//         if (!destination) {
//             showToast('Customer location coordinates not available', 'info');
//             return;
//         }
//         window.open(
//             `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`,
//             '_blank',
//             'noopener,noreferrer'
//         );
//     };

//     // ── Real leads from context ───────────────────────────────
//     const proAssignments = assignments.filter(a => a.professionalId === currentUser.id);

//     const sourceLeads = leads
//         .filter(lead => {
//             const assignment = proAssignments.find(a => a.leadId === lead.id);
//             if (!assignment) return false;

//             const curStatus = (assignment.status || '').toLowerCase();
//             if (curStatus === 'rejected') return false;

//             if (lead.status === 'Accepted' && lead.assignedTo !== currentUser.id) {
//                 return false;
//             }
//             return true;
//         })
//         .map(lead => {
//             const assignment = proAssignments.find(a => a.leadId === lead.id);
//             return { 
//                 ...lead, 
//                 assignmentStatus: assignment?.status || 'Sent', 
//                 assignmentId: assignment?.id,
//                 isTrackingActive: !!assignment?.id && assignment.id === activeTrackingJobId
//             };
//         });

//     // ── Apply search + status filter ──────────────────────────
//     const filteredLeads = sourceLeads.filter(lead => {
//         const s = (lead.assignmentStatus || '').toLowerCase();

//         const matchesSearch =
//             (lead.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//             (lead.id || '').toLowerCase().includes(searchTerm.toLowerCase());

//         const matchesStatus =
//             statusFilter === 'All' ||
//             (statusFilter === 'Open' && ['sent', 'viewed', 'open', 'new', 'Sent'].includes(s)) ||
//             (statusFilter === 'Accepted' && s === 'accepted' || s === 'Accepted') ||
//             (statusFilter === 'In Progress' && ['in progress', 'active', 'in_progress'].includes(s)) ||
//             (statusFilter === 'Completed' && s === 'completed' || s === 'Completed');

//         return matchesSearch && matchesStatus;
//     }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

//     // ── Action handler ────────────────────────────────────────
//     const handleAction = (type, lead) => {
//         if (type === 'view') {
//             setSelectedLead(lead);
//             setIsModalOpen(true);
//             return;
//         }

//         if (type === 'contact') {
//             navigate('/professional/messages', { state: { jobId: lead.assignmentId } });
//             return;
//         }

//         if (type === 'start') {
//             const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
//             if (assignmentId) {
//                 startJob(assignmentId);
//                 startLiveTracking(assignmentId, lead);
//                 openNavigation(lead);
//                 if (selectedLead?.id === lead.id) {
//                     setSelectedLead(prev => ({ ...prev, assignmentStatus: 'In Progress' }));
//                 }
//             } else {
//                 showToast('Assignment record not found.', 'error');
//             }
//             return;
//         }

//         if (type === 'navigate') {
//             openNavigation(lead);
//             return;
//         }

//         if (type === 'stopTracking') {
//             stopLiveTracking();
//             return;
//         }

//         if (type === 'toggleTracking') {
//             const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
//             if (!assignmentId) return;
//             if (lead.isTrackingActive) {
//                 stopLiveTracking();
//             } else {
//                 startLiveTracking(assignmentId, lead);
//                 showToast('Live tracking started', 'success');
//             }
//             return;
//         }

//         if (type === 'complete') {
//             const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
//             if (assignmentId) {
//                 completeJob(assignmentId);
//                 stopLiveTracking();
//                 if (selectedLead?.id === lead.id) {
//                     setSelectedLead(prev => ({ ...prev, assignmentStatus: 'Completed' }));
//                 }
//             } else {
//                 showToast('Assignment record not found.', 'error');
//             }
//             return;
//         }

//         if (type === 'accept' || type === 'reject') {
//             const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
//             if (assignmentId) {
//                 respondToLead(assignmentId, type);
//                 if (selectedLead?.id === lead.id) {
//                     if (type === 'reject') {
//                         setIsModalOpen(false);
//                         setSelectedLead(null);
//                     } else {
//                         setSelectedLead(prev => ({ ...prev, assignmentStatus: 'Accepted' }));
//                     }
//                 }
//                 showToast(
//                     type === 'accept'
//                         ? `✅ Lead from ${lead.customerName} accepted!`
//                         : `❌ Lead from ${lead.customerName} rejected.`,
//                     type === 'accept' ? 'success' : 'info'
//                 );
//             } else {
//                 showToast('Assignment record not found for this lead.', 'error');
//             }
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
//                     <p className="text-sm text-gray-500 mt-1">Manage and respond to service requests.</p>
//                 </div>
//             </div>

//             {/* Filters */}
//             <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100">
//                 <div className="flex-1 relative">
//                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                         type="text"
//                         placeholder="Search by ID or customer..."
//                         className="w-full pl-11 sm:pl-12 pr-4 sm:pr-5 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-gray-900 placeholder-gray-300 shadow-inner"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>
//                 <div className="flex gap-2 sm:gap-3">
//                     <div className="flex-1 xl:flex-none relative">
//                         <select
//                             className="w-full appearance-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-100 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer pr-8 sm:pr-10"
//                             value={statusFilter}
//                             onChange={(e) => setStatusFilter(e.target.value)}
//                         >
//                             <option value="All">All Status</option>
//                             <option value="Open">New / Open</option>
//                             <option value="Accepted">Accepted</option>
//                             <option value="In Progress">In Progress</option>
//                         </select>
//                         <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
//                             <ChevronRight size={12} className="rotate-90 sm:w-3.5" />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Lead Table */}
//             <LeadTable leads={filteredLeads} onAction={handleAction} />

//             {/* Detail Modal */}
//             <LeadDetailModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 lead={selectedLead}
//                 onAction={handleAction}
//             />
//         </div>
//     );
// };

// export default Leads;
import React, { useEffect, useRef, useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import LeadTable from '../../components/professional/LeadTable';
import LeadDetailModal from '../../components/professional/LeadDetailModal';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { getSocketOrigin } from '../../services/apiClient';

const Leads = () => {
    const { leads, assignments, currentUser, respondToLead, showToast, startJob, completeJob } = useMarketplace();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const navigate = useNavigate();

    // Modal state
    const [selectedLead, setSelectedLead] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTrackingJobId, setActiveTrackingJobId] = useState(null);
    const trackerRef = useRef({
        socket: null,
        watchId: null,
        lastEmitAt: 0,
        activeJobId: null,
        arrivedNotifiedForJob: null
    });

    const getLeadDestination = (lead) => {
        const lat = Number(
            lead?.customerLat ??
            lead?.latitude ??
            lead?.job?.customerLat ??
            lead?.job?.latitude ??
            null
        );
        const lng = Number(
            lead?.customerLng ??
            lead?.longitude ??
            lead?.job?.customerLng ??
            lead?.job?.longitude ??
            null
        );
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { lat, lng };
    };

    const haversineKm = (lat1, lon1, lat2, lon2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token || !currentUser?.id) return;
        const socket = io(getSocketOrigin(), {
            auth: { token },
            transports: ['websocket', 'polling']
        });
        trackerRef.current.socket = socket;
        return () => {
            if (trackerRef.current.watchId != null) {
                navigator.geolocation.clearWatch(trackerRef.current.watchId);
                trackerRef.current.watchId = null;
            }
            trackerRef.current.socket?.disconnect();
            trackerRef.current.socket = null;
        };
    }, [currentUser?.id]);

    const stopLiveTracking = () => {
        if (trackerRef.current.watchId != null) {
            navigator.geolocation.clearWatch(trackerRef.current.watchId);
            trackerRef.current.watchId = null;
        }
        trackerRef.current.activeJobId = null;
        trackerRef.current.arrivedNotifiedForJob = null;
        setActiveTrackingJobId(null);
        showToast('Live tracking stopped', 'info');
    };

    const startLiveTracking = (jobId, lead) => {
        if (!navigator.geolocation) {
            showToast('Geolocation not supported on this browser', 'error');
            return;
        }
        const destination = getLeadDestination(lead);
        trackerRef.current.activeJobId = jobId;
        trackerRef.current.arrivedNotifiedForJob = null;
        setActiveTrackingJobId(jobId);
        if (trackerRef.current.watchId != null) {
            navigator.geolocation.clearWatch(trackerRef.current.watchId);
            trackerRef.current.watchId = null;
        }
        trackerRef.current.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const now = Date.now();
                if (now - trackerRef.current.lastEmitAt < 4000) return;
                trackerRef.current.lastEmitAt = now;
                trackerRef.current.socket?.emit('location_update', { lat, lng, jobId });
                if (destination) {
                    const distanceKm = haversineKm(lat, lng, destination.lat, destination.lng);
                    if (distanceKm <= 0.1 && trackerRef.current.arrivedNotifiedForJob !== jobId) {
                        trackerRef.current.arrivedNotifiedForJob = jobId;
                        trackerRef.current.socket?.emit('professional_arrived', { jobId });
                    }
                }
            },
            () => showToast('Unable to read live location', 'error'),
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 3000 }
        );
    };

    const openNavigation = (lead) => {
        const destination = getLeadDestination(lead);
        const destinationText = String(lead?.location || '').trim();
        if (!destination && !destinationText) {
            showToast('Customer location not available', 'info');
            return;
        }
        // Leads screen should open map for the same location text shown in UI.
        // If text exists, prefer it to avoid stale/mismatched coordinates.
        const destinationParam = destinationText
            ? encodeURIComponent(destinationText)
            : `${destination.lat},${destination.lng}`;
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${destinationParam}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    // ── Real leads from context ───────────────────────────────
    const proAssignments = assignments.filter(a => a.professionalId === currentUser.id);

    const sourceLeads = leads
        .filter(lead => {
            const assignment = proAssignments.find(a => a.leadId === lead.id);
            if (!assignment) return false;

            const curStatus = (assignment.status || '').toLowerCase();
            if (curStatus === 'rejected') return false;

            if (lead.status === 'Accepted' && lead.assignedTo !== currentUser.id) {
                return false;
            }
            return true;
        })
        .map(lead => {
            const assignment = proAssignments.find(a => a.leadId === lead.id);
            return { 
                ...lead, 
                assignmentStatus: assignment?.status || 'Sent', 
                assignmentId: assignment?.id,
                isTrackingActive: !!assignment?.id && assignment.id === activeTrackingJobId
            };
        });

    // ── Apply search + status filter ──────────────────────────
    const filteredLeads = sourceLeads.filter(lead => {
        const s = (lead.assignmentStatus || '').toLowerCase();

        const matchesSearch =
            (lead.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.id || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Open' && ['sent', 'viewed', 'open', 'new', 'Sent'].includes(s)) ||
            (statusFilter === 'Accepted' && s === 'accepted' || s === 'Accepted') ||
            (statusFilter === 'In Progress' && ['in progress', 'active', 'in_progress'].includes(s)) ||
            (statusFilter === 'Completed' && s === 'completed' || s === 'Completed');

        return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    // ── Action handler ────────────────────────────────────────
    const handleAction = (type, lead) => {
        if (type === 'view') {
            setSelectedLead(lead);
            setIsModalOpen(true);
            return;
        }

        if (type === 'contact') {
            navigate('/professional/messages', { state: { jobId: lead.assignmentId } });
            return;
        }

        if (type === 'start') {
            const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
            if (assignmentId) {
                startJob(assignmentId);
                startLiveTracking(assignmentId, lead);
                openNavigation(lead);
                if (selectedLead?.id === lead.id) {
                    setSelectedLead(prev => ({ ...prev, assignmentStatus: 'In Progress' }));
                }
            } else {
                showToast('Assignment record not found.', 'error');
            }
            return;
        }

        if (type === 'navigate') {
            openNavigation(lead);
            return;
        }

        if (type === 'stopTracking') {
            stopLiveTracking();
            return;
        }

        if (type === 'toggleTracking') {
            const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
            if (!assignmentId) return;
            if (lead.isTrackingActive) {
                stopLiveTracking();
            } else {
                startLiveTracking(assignmentId, lead);
                showToast('Live tracking started', 'success');
            }
            return;
        }

        if (type === 'complete') {
            const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
            if (assignmentId) {
                completeJob(assignmentId);
                stopLiveTracking();
                if (selectedLead?.id === lead.id) {
                    setSelectedLead(prev => ({ ...prev, assignmentStatus: 'Completed' }));
                }
            } else {
                showToast('Assignment record not found.', 'error');
            }
            return;
        }

        if (type === 'accept' || type === 'reject') {
            const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
            if (assignmentId) {
                respondToLead(assignmentId, type);
                if (selectedLead?.id === lead.id) {
                    if (type === 'reject') {
                        setIsModalOpen(false);
                        setSelectedLead(null);
                    } else {
                        setSelectedLead(prev => ({ ...prev, assignmentStatus: 'Accepted' }));
                    }
                }
                showToast(
                    type === 'accept'
                        ? `✅ Lead from ${lead.customerName} accepted!`
                        : `❌ Lead from ${lead.customerName} rejected.`,
                    type === 'accept' ? 'success' : 'info'
                );
            } else {
                showToast('Assignment record not found for this lead.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and respond to service requests.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID or customer..."
                        className="w-full pl-11 sm:pl-12 pr-4 sm:pr-5 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-gray-900 placeholder-gray-300 shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 sm:gap-3">
                    <div className="flex-1 xl:flex-none relative">
                        <select
                            className="w-full appearance-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-100 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer pr-8 sm:pr-10"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Open">New / Open</option>
                            <option value="Accepted">Accepted</option>
                            <option value="In Progress">In Progress</option>
                        </select>
                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ChevronRight size={12} className="rotate-90 sm:w-3.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lead Table */}
            <LeadTable leads={filteredLeads} onAction={handleAction} />

            {/* Detail Modal */}
            <LeadDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                lead={selectedLead}
                onAction={handleAction}
            />
        </div>
    );
};

export default Leads;