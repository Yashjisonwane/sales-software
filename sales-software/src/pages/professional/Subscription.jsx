import { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Check, Zap, Shield, Crown, X, CreditCard, Clock } from 'lucide-react';

const UpgradeModal = ({ plan, onConfirm, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-in slide-in-from-bottom-4 duration-300 overflow-hidden text-center">
                <div className="px-7 pt-10 pb-6 flex flex-col items-center">
                    <div className={`h-16 w-16 rounded-2xl ${plan.bg} ${plan.color} flex items-center justify-center mb-6 shadow-inner`}>
                        <plan.icon size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Request Upgrade</h2>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                        Admin ko upgrade request bhejenge. Approve hone ke baad aapka naya plan active ho jayega.
                    </p>
                </div>

                <div className="px-7 pb-8 pt-4 flex gap-3 border-t border-gray-50 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                    >
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    );
};

const Subscription = () => {
    const { currentUser, updateSubscription, subscriptionPlans } = useMarketplace();
    const [upgradePlan, setUpgradePlan] = useState(null); 

    const plans = (subscriptionPlans || []).map(p => ({
        ...p,
        icon: p.name === 'Starter' ? Zap : p.name === 'Pro' || p.name === 'Professional' ? Shield : Crown,
        color: p.name === 'Starter' ? 'text-blue-600' : (p.name === 'Pro' || p.name === 'Professional') ? 'text-purple-600' : 'text-orange-600',
        bg: p.name === 'Starter' ? 'bg-blue-50' : (p.name === 'Pro' || p.name === 'Professional') ? 'bg-purple-50' : 'bg-orange-50',
        featureList: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? JSON.parse(p.features) : ['Standard Access']),
    }));

    const currentPlanName = currentUser?.plan?.name || 'Starter';
    const pendingRequest = currentUser?.subscriptionUpgradeRequests?.[0];

    const handleConfirmUpgrade = async () => {
        if (upgradePlan) {
            await updateSubscription(upgradePlan.name);
            setUpgradePlan(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900">Subscription Management</h1>
                <p className="text-gray-500 mt-2">Manage your current plan and explore premium business tools.</p>
            </div>

            {pendingRequest && (
                <div className="max-w-3xl mx-auto bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 animate-pulse shadow-sm">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-blue-900 text-sm uppercase tracking-tight">Upgrade Pending Approval</h4>
                            <p className="text-xs text-blue-600 font-medium">Aapne <span className="font-black text-blue-800">{pendingRequest.plan?.name} Plan</span> ke liye request bheji hai. Admin validation pending hai.</p>
                        </div>
                    </div>
                    <div className="hidden sm:block px-4 py-2 bg-blue-600/10 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-200">
                        Awaiting Admin
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, i) => {
                    const isCurrent = plan.name === currentPlanName;
                    const isRequested = pendingRequest?.plan?.name === plan.name;
                    const Icon = plan.icon;
                    return (
                        <div key={plan.id || i} className={`relative bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-300 ${isCurrent ? 'border-blue-600 shadow-xl shadow-blue-50 scale-105 z-10' : 'border-gray-50 hover:border-blue-100 hover:shadow-lg'}`}>
                            {isCurrent && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    ACTIVE PLAN
                                </div>
                            )}

                            <div className={`h-14 w-14 rounded-2xl ${plan.bg} ${plan.color} flex items-center justify-center mb-6 shadow-inner`}>
                                <Icon size={28} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black text-gray-900">${plan.price}</span>
                                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">/mo</span>
                            </div>

                            <ul className="space-y-4 mb-10 min-h-[160px]">
                                {plan.featureList.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                        <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => !isCurrent && !isRequested && setUpgradePlan(plan)}
                                disabled={isCurrent || isRequested}
                                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                                    isCurrent ? 'bg-blue-50 text-blue-400 cursor-not-allowed border border-blue-100' : 
                                    isRequested ? 'bg-orange-50 text-orange-500 cursor-not-allowed border border-orange-100' :
                                    'bg-slate-900 text-white hover:bg-black shadow-xl hover:-translate-y-1 active:scale-95'
                                }`}
                            >
                                {isCurrent ? 'Current Plan' : isRequested ? 'Requested' : `Select ${plan.name}`}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="max-w-6xl mx-auto bg-slate-900 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl">?</div>
                    <div>
                        <h4 className="text-xl font-bold text-white">Need a custom enterprise solution?</h4>
                        <p className="text-sm text-slate-400 mt-1">Contact our support desk for volume discounts and custom features.</p>
                    </div>
                </div>
                <button className="relative z-10 px-8 py-4 bg-white text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/20 shrink-0">
                    Contact Support
                </button>
            </div>

            {upgradePlan && (
                <UpgradeModal
                    plan={upgradePlan}
                    onConfirm={handleConfirmUpgrade}
                    onClose={() => setUpgradePlan(null)}
                />
            )}
        </div>
    );
};

export default Subscription;
