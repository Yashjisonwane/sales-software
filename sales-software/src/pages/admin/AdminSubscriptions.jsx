import React, { useState } from 'react';
import { Zap, Shield, Crown, CreditCard, Plus, Edit, Trash2, XCircle, AlertCircle, Check } from 'lucide-react';
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
    const { subscriptionPlans, showToast, professionals } = useMarketplace();
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

    // Sync plans from context
    React.useEffect(() => {
        if (subscriptionPlans?.length > 0) {
            setPlans(subscriptionPlans.map(p => ({
                ...p,
                icon: p.name === 'Starter' ? Zap : p.name === 'Professional' ? Shield : Crown,
                color: p.name === 'Starter' ? 'text-blue-600' : p.name === 'Professional' ? 'text-purple-600' : 'text-orange-600',
                bg: p.name === 'Starter' ? 'bg-blue-50' : p.name === 'Professional' ? 'bg-purple-50' : 'bg-orange-50',
                featureList: p.name === 'Starter' ? ['Basic Dashboard', 'Email Notifications'] : ['Unlimited CRM Access', 'Live Tracking'],
                features: { support: p.name === 'Starter' ? 'Email Support' : 'Priority Support' }
            })));
        }
        
        // Fetch subscriptions (using mocked data for history if backend is empty)
        const loadSubs = async () => {
            setLoading(true);
            const res = await apiService.fetchActiveSubscriptions();
            if (res.success && res.data.length > 0) {
                setSubscriptions(res.data);
            } else {
                setSubscriptions(MOCK_SUBS); // Fallback to help admin see the UI if db is empty
            }
            setLoading(false);
        };
        loadSubs();
    }, [subscriptionPlans]);

    const sorted = [...subscriptions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // ── Handlers ──────────────────────────────────────────────
    const handleAddSub = async (formData) => {
        // Find if name matches an existing professional to get their ID
        const matchedWorker = professionals.find(p => p.name.toLowerCase() === formData.name.toLowerCase());
        
        const payload = {
            professionalId: matchedWorker?.id, // Send ID if found
            professionalName: formData.name,
            planName: formData.plan,
            status: formData.status
        };
        const res = await apiService.enrollInSubscription(payload);
        if (res.success) {
            showToast('Subscription added successfully', 'success');
            // Refresh logs
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
                                    <div className="flex gap-2 transition-all duration-300">
                                        <button onClick={() => { setSelectedPlan(plan); setShowEditPlanModal(true); }} className="p-2.5 bg-gray-50 text-amber-600 hover:bg-amber-100 border border-amber-100 rounded-xl transition-all shadow-sm" title="Edit Plan">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => { setSelectedPlan(plan); setShowDeletePlanConfirm(true); }} className="p-2.5 bg-gray-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all shadow-sm" title="Delete Plan">
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
                                    {plan.leads || 'Unlimited'} Leads per month
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
                                        <span className="text-xs font-bold text-gray-400 italic capitalize">{plan.features?.support}</span>
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

                {/* Responsive List View */}
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
                                                {sub.name?.charAt(0) || 'P'}
                                            </div>
                                            <span className="text-sm font-bold text-blue-600 cursor-pointer hover:underline">
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
                                        <div className="flex justify-end gap-1.5">
                                            <button onClick={() => { setSelectedSub(sub); setShowEditModal(true); }} className="p-2 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-all" title="Edit">
                                                <Edit size={14} />
                                            </button>
                                            {sub.status === 'Active' && (
                                                <button onClick={() => { setSelectedSub(sub); setShowCancelConfirm(true); }} className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-all" title="Cancel Subscription">
                                                    <XCircle size={14} />
                                                </button>
                                            )}
                                            <button onClick={() => { setSelectedSub(sub); setShowDeleteConfirm(true); }} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all" title="Delete">
                                                <Trash2 size={14} />
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
                        <div key={sub.id} className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {sub.name?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{sub.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{sub.plan} Plan</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${sub.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {sub.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-2 rounded-xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Amount</p>
                                    <p className="text-sm font-black text-gray-900">{sub.amount}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Billing Date</p>
                                    <p className="text-sm font-bold text-gray-600">{sub.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setSelectedSub(sub); setShowEditModal(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-yellow-50 text-yellow-700 font-bold text-xs rounded-xl border border-yellow-200">
                                    <Edit size={14} /> Edit
                                </button>
                                {sub.status === 'Active' && (
                                    <button onClick={() => { setSelectedSub(sub); setShowCancelConfirm(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-50 text-orange-700 font-bold text-xs rounded-xl border border-orange-200">
                                        <XCircle size={14} /> Cancel
                                    </button>
                                )}
                                <button onClick={() => { setSelectedSub(sub); setShowDeleteConfirm(true); }} className="p-2.5 bg-red-50 text-red-700 rounded-xl border border-red-200">
                                    <Trash2 size={14} />
                                </button>
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
                onConfirm={() => {
                    setPlans(prev => prev.filter(p => p.id !== selectedPlan?.id));
                    showToast('Plan deleted successfully', 'success');
                    setShowDeletePlanConfirm(false);
                }} 
                title="Delete Subscription Plan" 
                message={`Are you sure you want to delete the ${selectedPlan?.name} plan? Professionals already on this plan will remain unaffected.`} 
                icon={AlertCircle} 
                confirmText="Delete Plan" 
                type="danger" 
            />
            <EditPlanModal isOpen={showEditPlanModal} onClose={() => { setShowEditPlanModal(false); setSelectedPlan(null); }} plan={selectedPlan} onSave={(p) => setPlans(prev => prev.map(old => old.id === p.id ? p : old))} />
        </div>
    );
};

export default AdminSubscriptions;
