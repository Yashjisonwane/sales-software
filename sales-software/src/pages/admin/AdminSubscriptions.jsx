import React, { useState } from 'react';
import { Zap, Shield, Crown, CreditCard, Plus, Edit, Trash2, XCircle, AlertCircle, Check } from 'lucide-react';
import AddSubscriptionModal from '../../components/subscriptions/AddSubscriptionModal';
import EditSubscriptionModal from '../../components/subscriptions/EditSubscriptionModal';
import SubscriptionDetailsModal from '../../components/subscriptions/SubscriptionDetailsModal';
import ConfirmationModal from '../../components/ConfirmationModal';

import EditPlanModal from '../../components/subscriptions/EditPlanModal';

const INITIAL_PLANS = [
    {
        id: 'P1',
        name: 'Starter',
        price: '29',
        leadsLimit: '10',
        features: { priority: false, support: 'Email Support', premiumAccess: false },
        featureList: ['Basic Dashboard', 'Email Notifications'],
        icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50'
    },
    {
        id: 'P2',
        name: 'Pro',
        price: '79',
        leadsLimit: '50',
        features: { priority: true, support: 'Priority Support', premiumAccess: false },
        featureList: ['Unlimited CRM Access', 'SMS Alerts', 'Live Tracking'],
        icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50'
    },
    {
        id: 'P3',
        name: 'Premium',
        price: '149',
        leadsLimit: 'Unlimited',
        features: { priority: true, support: '24/7 Dedicated Support', premiumAccess: true },
        featureList: ['Advanced Analytics', 'Geo-fencing', 'White-labeling'],
        icon: Crown, color: 'text-orange-600', bg: 'bg-orange-50'
    },
];

const MOCK_SUBS = [
    { id: 'SUB-1', name: 'John the Plumber', business: 'Doe Plumbing', plan: 'Pro', amount: '$79', date: '2025-03-01', status: 'Active' },
    { id: 'SUB-2', name: 'Mary Electric', business: 'Mary Electric Co.', plan: 'Premium', amount: '$149', date: '2025-03-03', status: 'Active' },
    { id: 'SUB-3', name: 'CleanPro Services', business: 'CleanPro LLC', plan: 'Starter', amount: '$29', date: '2025-02-28', status: 'Cancelled' },
    { id: 'SUB-4', name: 'HVAC Masters', business: 'HVAC Masters Inc.', plan: 'Pro', amount: '$79', date: '2025-03-05', status: 'Active' },
];

const AdminSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState(MOCK_SUBS);
    const [plans, setPlans] = useState(INITIAL_PLANS);

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

    // Sort by date, newest first
    const sorted = [...subscriptions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Dynamic plan counts
    const getPlanCount = (planName) => {
        return subscriptions.filter(s => s.plan === planName && s.status === 'Active').length;
    };

    // ── Handlers ──────────────────────────────────────────────

    const handleAddSub = (newSub) => {
        setSubscriptions(prev => [newSub, ...prev]);
    };

    const handleNameClick = (sub) => {
        setSelectedSub(sub);
        setShowDetailsModal(true);
    };

    const handleEditClick = (sub) => {
        setSelectedSub(sub);
        setShowEditModal(true);
    };

    const handleSaveEdit = (updatedSub) => {
        setSubscriptions(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
    };

    const handleCancelClick = (sub) => {
        setSelectedSub(sub);
        setShowCancelConfirm(true);
    };

    const handleConfirmCancel = () => {
        if (selectedSub) {
            setSubscriptions(prev => prev.map(s => s.id === selectedSub.id ? { ...s, status: 'Cancelled' } : s));
        }
    };

    const handleDeleteClick = (sub) => {
        setSelectedSub(sub);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (selectedSub) {
            setSubscriptions(prev => prev.filter(s => s.id !== selectedSub.id));
        }
    };

    // Plan management handlers
    const handleEditPlanClick = (plan) => {
        setSelectedPlan(plan);
        setShowEditPlanModal(true);
    };

    const handleSavePlan = (updatedPlan) => {
        setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    };

    const handleDeletePlanClick = (plan) => {
        setSelectedPlan(plan);
        setShowDeletePlanConfirm(true);
    };

    const handleConfirmDeletePlan = () => {
        if (selectedPlan) {
            setPlans(prev => prev.filter(p => p.id !== selectedPlan.id));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Revenue & Subscriptions</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage platform tiers and monitor professional billing.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
                >
                    <Plus size={16} strokeWidth={2.5} /> Add Subscription
                </button>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const Icon = plan.icon;
                    return (
                        <div key={plan.id} className="relative group/card">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex flex-col h-full overflow-hidden">
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`${plan.bg} ${plan.color} p-4 rounded-2xl shadow-sm transition-transform`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity translate-x-4 group-hover/card:translate-x-0 transition-all duration-300">
                                        <button onClick={() => { setSelectedPlan(plan); setShowEditPlanModal(true); }} className="p-2.5 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => { setSelectedPlan(plan); setShowDeletePlanConfirm(true); }} className="p-2.5 bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-white hover:shadow-md rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name} Plan</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-bold text-gray-900">${plan.price}</span>
                                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">/ month</span>
                                    </div>
                                </div>

                                <div className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 self-start border border-blue-100 shadow-sm">
                                    {plan.leadsLimit} Leads per month
                                </div>

                                <div className="space-y-4 mb-8 flex-1">
                                    {plan.featureList?.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                                                <Check size={10} className="text-blue-600" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-600">{feature}</span>
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-3 opacity-60">
                                        <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                                            <Check size={10} className="text-gray-400" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 italic capitalize">{plan.features.support}</span>
                                    </div>
                                </div>

                                <button 
                                    className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200 group-hover/card:bg-blue-600 group-hover/card:shadow-blue-200 transition-all active:scale-95"
                                >
                                    Select Plan
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Subscriptions Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Recent Subscriptions</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Live Billing Log</p>
                        </div>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                <th className="px-8 py-5">Professional</th>
                                <th className="px-8 py-5">Plan</th>
                                <th className="px-8 py-5">Amount</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {sorted.map(sub => (
                                <tr key={sub.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                                                {sub.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => handleNameClick(sub)}>
                                                {sub.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">{sub.plan}</td>
                                    <td className="px-8 py-5 text-sm font-black text-gray-900">{sub.amount}</td>
                                    <td className="px-8 py-5 text-sm text-gray-400 font-medium">{sub.date}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${sub.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                            <button onClick={() => handleEditClick(sub)} className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            {sub.status === 'Active' && (
                                                <button onClick={() => handleCancelClick(sub)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Cancel Subscription">
                                                    <XCircle size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {sorted.length === 0 && (
                    <div className="text-center py-20 animate-in fade-in duration-500">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                            <CreditCard size={28} className="text-gray-200" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No subscriptions found</h3>
                    </div>
                )}
            </div>

            {/* ── Modals ──────────────────────────────────────────── */}

            <AddSubscriptionModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddSub}
                plans={plans}
            />

            <SubscriptionDetailsModal
                isOpen={showDetailsModal}
                onClose={() => { setShowDetailsModal(false); setSelectedSub(null); }}
                subscription={selectedSub}
            />

            <EditSubscriptionModal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setSelectedSub(null); }}
                subscription={selectedSub}
                onSave={handleSaveEdit}
                plans={plans}
            />

            <ConfirmationModal
                isOpen={showCancelConfirm}
                onClose={() => { setShowCancelConfirm(false); setSelectedSub(null); }}
                onConfirm={handleConfirmCancel}
                title="Cancel Subscription"
                message={`Are you sure you want to cancel ${selectedSub ? selectedSub.name + "'s" : 'this'} subscription? They will lose access to premium features.`}
                icon={AlertCircle}
                confirmText="Cancel Subscription"
                type="warning"
            />

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => { setShowDeleteConfirm(false); setSelectedSub(null); }}
                onConfirm={handleConfirmDelete}
                title="Delete Subscription"
                message={`Are you sure you want to permanently delete ${selectedSub ? selectedSub.name + "'s" : 'this'} subscription record? This cannot be undone.`}
                icon={AlertCircle}
                confirmText="Delete"
                type="danger"
            />

            {/* Plan Management Modals */}
            <EditPlanModal
                isOpen={showEditPlanModal}
                onClose={() => { setShowEditPlanModal(false); setSelectedPlan(null); }}
                plan={selectedPlan}
                onSave={handleSavePlan}
            />

            <ConfirmationModal
                isOpen={showDeletePlanConfirm}
                onClose={() => { setShowDeletePlanConfirm(false); setSelectedPlan(null); }}
                onConfirm={handleConfirmDeletePlan}
                title="Delete Subscription Plan"
                message={`Are you sure you want to delete the ${selectedPlan ? selectedPlan.name : 'this'} plan? Professionals currently on this plan may be affected.`}
                icon={AlertCircle}
                confirmText="Delete Plan"
                type="danger"
            />
        </div>
    );
};

export default AdminSubscriptions;
