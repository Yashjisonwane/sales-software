import React, { useState } from 'react';
import { Zap, Shield, Crown, CreditCard, Plus, Edit, Trash2, XCircle, AlertCircle, Check, Settings, Clock, CheckCircle2, XCircle as RejectIcon } from 'lucide-react';
import * as apiService from '../../services/apiService';
import { useMarketplace } from '../../context/MarketplaceContext';
import AddSubscriptionModal from '../../components/subscriptions/AddSubscriptionModal';
import EditSubscriptionModal from '../../components/subscriptions/EditSubscriptionModal';
import SubscriptionDetailsModal from '../../components/subscriptions/SubscriptionDetailsModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import EditPlanModal from '../../components/subscriptions/EditPlanModal';

const MOCK_SUBS = [
    { id: 'SUB-1', name: 'John the Plumber', business: 'Doe Plumbing', plan: 'Professional', amount: '$99', date: '2025-03-01', status: 'Active' },
    { id: 'SUB-2', name: 'Mary Electric', business: 'Mary Electric Co.', plan: 'Enterprise', amount: '$299', date: '2025-03-03', status: 'Active' },
];

const AdminSubscriptions = () => {
    const mp = useMarketplace();
    const { subscriptionPlans, showToast, professionals, upgradeRequests, approveUpgradeRequest, rejectUpgradeRequest } = mp;
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState([]);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedSub, setSelectedSub] = useState(null);

    // Plan management states
    const [showEditPlanModal, setShowEditPlanModal] = useState(false);
    const [showDeletePlanConfirm, setShowDeletePlanConfirm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const pendingRequests = upgradeRequests?.filter(r => r.status === 'PENDING') || [];

    // Sync plans from context
    React.useEffect(() => {
        if (subscriptionPlans?.length > 0) {
            setPlans(subscriptionPlans.map(p => ({
                ...p,
                icon: p.name.toLowerCase().includes('starter') ? Zap : p.name.toLowerCase().includes('professional') || p.name.toLowerCase().includes('care') ? Shield : Crown,
                color: p.name.toLowerCase().includes('starter') ? 'text-blue-600' : p.name.toLowerCase().includes('professional') || p.name.toLowerCase().includes('care') ? 'text-purple-600' : 'text-orange-600',
                bg: p.name.toLowerCase().includes('starter') ? 'bg-blue-50' : p.name.toLowerCase().includes('professional') || p.name.toLowerCase().includes('care') ? 'bg-purple-50' : 'bg-orange-50',
                featureList: Array.isArray(p.features) ? p.features : []
            })));
        }
        
        const loadSubs = async () => {
            setLoading(true);
            const res = await apiService.fetchActiveSubscriptions();
            if (res.success && res.data.length > 0) {
                setSubscriptions(res.data);
            } else {
                setSubscriptions(MOCK_SUBS);
            }
            setLoading(false);
        };
        loadSubs();
    }, [subscriptionPlans]);

    const sorted = [...subscriptions].sort((a, b) => new Date(b.date) - new Date(a.date));

    const handleAddSub = async (formData) => {
        const matchedWorker = professionals.find(p => p.name.toLowerCase() === formData.name.toLowerCase());
        const payload = {
            professionalId: matchedWorker?.id,
            professionalName: formData.name,
            planName: formData.plan,
            status: formData.status
        };
        const res = await apiService.enrollInSubscription(payload);
        if (res.success) {
            showToast('Subscription added successfully', 'success');
            const freshLogs = await apiService.fetchActiveSubscriptions();
            if (freshLogs.success) setSubscriptions(freshLogs.data);
            setShowAddModal(false);
        } else {
            showToast(res.error || 'Enrollment failed', 'error');
        }
    };

    const handleSaveEdit = (updatedSub) => {
        setSubscriptions(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
    };

    const handleConfirmCancel = () => {
        if (selectedSub) {
            setSubscriptions(prev => prev.map(s => s.id === selectedSub.id ? { ...s, status: 'Cancelled' } : s));
            showToast('Subscription cancelled', 'info');
        }
    };

    const handleConfirmDelete = () => {
        if (selectedSub) {
            setSubscriptions(prev => prev.filter(s => s.id !== selectedSub.id));
            showToast('Record deleted', 'success');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Revenue & Membership</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium italic">Manage platform tiers and monitor professional billing cycles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setSelectedPlan({}); setShowEditPlanModal(true); }}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-3 px-6 rounded-2xl shadow-sm transition-all active:scale-95"
                    >
                        <Settings size={16} strokeWidth={2.5} /> Create Plan
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={16} strokeWidth={2.5} /> Enroll Professional
                    </button>
                </div>
            </div>

            {/* Upgrade Requests Section - NEW */}
            {pendingRequests.length > 0 && (
                <div className="bg-amber-50 rounded-3xl border border-amber-100 shadow-sm overflow-hidden animate-in slide-in-from-top-4 duration-500">
                    <div className="px-8 py-6 border-b border-amber-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white text-amber-600 rounded-xl flex items-center justify-center shadow-sm border border-amber-100 animate-pulse">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-amber-900 leading-none">Pending Upgrades</h2>
                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Professional plan approval requests</p>
                            </div>
                        </div>
                        <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                            {pendingRequests.length} NEW
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-amber-100/50">
                                {pendingRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-white/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">
                                                    {req.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{req.user?.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{req.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="px-3 py-1 bg-white border border-amber-200 text-amber-700 rounded-lg text-[10px] font-black tracking-widest uppercase">
                                                    {req.plan?.name}
                                                </div>
                                                <span className="text-xs text-amber-400 font-bold">→ Upgrade</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-gray-500 font-bold">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => mp.approveUpgradeRequest(req.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95"
                                                >
                                                    <CheckCircle2 size={14} strokeWidth={3} /> Approve
                                                </button>
                                                <button 
                                                    onClick={() => mp.rejectUpgradeRequest(req.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                                >
                                                    <RejectIcon size={14} strokeWidth={3} /> Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const Icon = plan.icon;
                    return (
                        <div key={plan.id} className="relative group/card">
                            <div className="bg-white rounded-[2rem] border-2 border-transparent hover:border-blue-600 shadow-xl shadow-gray-100 transition-all duration-500 p-6 flex flex-col h-full overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`${plan.bg} ${plan.color} p-4 rounded-2xl shadow-inner transition-transform group-hover/card:scale-110 duration-500`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setSelectedPlan(plan); setShowEditPlanModal(true); }} className="p-2.5 bg-gray-50 text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit Plan">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => { setSelectedPlan(plan); setShowDeletePlanConfirm(true); }} className="p-2.5 bg-gray-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all" title="Delete Plan">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-black text-gray-900 mb-1">{plan.name} Plan</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-gray-900">${plan.price}</span>
                                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">/ mo</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-2 flex-1">
                                    <div className="flex items-center gap-3 text-xs font-bold text-blue-600 italic">
                                        {plan.leads || 'Unlimited'} Leads Included
                                    </div>
                                    {plan.featureList?.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-sm border border-green-100 font-bold">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Subscriptions Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden min-h-[400px]">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-gray-100 shadow-sm text-blue-600 rounded-2xl flex items-center justify-center">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Subscription History</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Monitored Revenue Stream</p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                <th className="px-10 py-6">Professional</th>
                                <th className="px-10 py-6">Plan</th>
                                <th className="px-10 py-6">Amount</th>
                                <th className="px-10 py-6">Date</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {sorted.map(sub => (
                                <tr key={sub.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs shadow-sm">
                                                {sub.name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-gray-900">{sub.name}</span>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{sub.business}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg text-[10px] font-black tracking-widest uppercase">
                                            {sub.plan}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-sm font-black text-gray-900">{sub.amount}</td>
                                    <td className="px-10 py-6 text-sm text-gray-400 font-bold uppercase tracking-tighter italic">{sub.date}</td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${sub.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => { setSelectedSub(sub); setShowEditModal(true); }} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            {sub.status === 'Active' && (
                                                <button onClick={() => { setSelectedSub(sub); setShowCancelConfirm(true); }} className="p-3 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all" title="Cancel Subscription">
                                                    <XCircle size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => { setSelectedSub(sub); setShowDeleteConfirm(true); }} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-50">
                    {sorted.map(sub => (
                        <div key={sub.id} className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {sub.name?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{sub.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">{sub.plan} Plan</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${sub.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {sub.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl shadow-inner">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                    <p className="text-lg font-black text-gray-900">{sub.amount}</p>
                                </div>
                                <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl shadow-inner">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Billing Date</p>
                                    <p className="text-sm font-bold text-gray-600 italic uppercase tracking-tighter">{sub.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => { setSelectedSub(sub); setShowEditModal(true); }} className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-gray-100 text-gray-700 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-sm">
                                    <Edit size={14} /> Edit
                                </button>
                                {sub.status === 'Active' && (
                                    <button onClick={() => { setSelectedSub(sub); setShowCancelConfirm(true); }} className="flex-1 flex items-center justify-center gap-2 py-4 bg-orange-50 text-orange-700 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-orange-100 shadow-sm">
                                        <XCircle size={14} /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AddSubscriptionModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddSub} plans={plans} professionals={useMarketplace().professionals} />
            <SubscriptionDetailsModal isOpen={showDetailsModal} onClose={() => { setShowDetailsModal(false); setSelectedSub(null); }} subscription={selectedSub} />
            <EditSubscriptionModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setSelectedSub(null); }} subscription={selectedSub} onSave={handleSaveEdit} plans={plans} />
            <ConfirmationModal isOpen={showCancelConfirm} onClose={() => { setShowCancelConfirm(false); setSelectedSub(null); }} onConfirm={handleConfirmCancel} title="Cancel Subscription" message="Are you sure?" icon={AlertCircle} confirmText="Cancel Subscription" type="warning" />
            <ConfirmationModal isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setSelectedSub(null); }} onConfirm={handleConfirmDelete} title="Delete Record" message="Are you sure?" icon={AlertCircle} confirmText="Delete" type="danger" />
            <ConfirmationModal 
                isOpen={showDeletePlanConfirm} 
                onClose={() => { setShowDeletePlanConfirm(false); setSelectedPlan(null); }} 
                onConfirm={async () => {
                    const result = await mp.deleteSubscriptionPlan(selectedPlan?.id);
                    if (result) setShowDeletePlanConfirm(false);
                }} 
                title="Delete Subscription Plan" 
                message={`Are you sure you want to delete the ${selectedPlan?.name} plan? Professionals already on this plan will remain unaffected.`} 
                icon={AlertCircle} 
                confirmText="Delete Plan" 
                type="danger" 
            />
            <EditPlanModal 
                isOpen={showEditPlanModal} 
                onClose={() => { setShowEditPlanModal(false); setSelectedPlan(null); }} 
                plan={selectedPlan} 
                onSave={async (p) => {
                    const res = selectedPlan?.id 
                        ? await mp.editSubscriptionPlan(selectedPlan.id, p)
                        : await mp.addSubscriptionPlan(p);
                    if (res) setShowEditPlanModal(false);
                }} 
            />
        </div>
    );
};

export default AdminSubscriptions;
