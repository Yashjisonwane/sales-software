import { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Check, Zap, Shield, Crown, X, CreditCard, Smartphone, Building2 } from 'lucide-react';

const PAYMENT_METHODS = ['UPI', 'Card', 'Net Banking'];

const UpgradeModal = ({ plan, currentUser, onConfirm, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-in slide-in-from-bottom-4 duration-300 overflow-hidden text-center">
                {/* Header / Icon */}
                <div className="px-7 pt-10 pb-6 flex flex-col items-center">
                    <div className={`h-16 w-16 rounded-2xl ${plan.bg} ${plan.color} flex items-center justify-center mb-6 shadow-inner`}>
                        <plan.icon size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Upgrade Plan</h2>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        Are you sure you want to upgrade to {plan.name}?
                    </p>
                </div>

                {/* Footer */}
                <div className="px-7 pb-8 pt-4 flex gap-3 border-t border-gray-50 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95"
                    >
                        Confirm Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
};

const Subscription = () => {
    const { currentUser, updateSubscription } = useMarketplace();
    const [upgradePlan, setUpgradePlan] = useState(null); // plan object to upgrade to

    const plans = [
        {
            name: 'Starter',
            price: '$29',
            icon: Zap,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            features: ['10 leads / month', 'Basic profile', 'Email alerts', 'Standard support'],
        },
        {
            name: 'Pro',
            price: '$79',
            icon: Shield,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            features: ['50 leads / month', 'Featured profile', 'SMS & Email alerts', 'Priority support', 'Analytics'],
        },
        {
            name: 'Premium',
            price: '$149',
            icon: Crown,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            features: ['Unlimited leads', 'Top tier placement', 'Immediate alerts', '24/7 Concierge', 'Advanced CRM'],
        }
    ];

    const currentPlanName = currentUser.subscriptionPlan || 'Starter';

    const handleUpgradeClick = (plan) => {
        setUpgradePlan(plan);
    };

    const handleConfirmUpgrade = () => {
        if (upgradePlan) {
            updateSubscription(upgradePlan.name);
            setUpgradePlan(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900">Subscription Plans</h1>
                <p className="text-gray-500 mt-2">Grow your business with premium lead placement and advanced tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, i) => {
                    const isCurrent = plan.name === currentPlanName;
                    const Icon = plan.icon;
                    return (
                        <div key={i} className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${isCurrent ? 'border-blue-600 shadow-lg scale-105 z-10' : 'border-gray-100'}`}>
                            {isCurrent && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                    Current Plan
                                </div>
                            )}

                            <div className={`h-14 w-14 rounded-2xl ${plan.bg} ${plan.color} flex items-center justify-center mb-6`}>
                                <Icon size={28} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                                <span className="text-gray-500 font-bold text-sm">/month</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                        <Check size={16} className="text-green-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => !isCurrent && handleUpgradeClick(plan)}
                                className={`w-full py-4 rounded-xl font-bold transition-all ${isCurrent
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-black shadow-lg hover:-translate-y-1'
                                    }`}
                            >
                                {isCurrent ? 'Your Active Plan' : `Upgrade to ${plan.name}`}
                            </button>

                            {isCurrent && plan.name !== 'Starter' && (
                                <button
                                    onClick={() => updateSubscription('Starter')}
                                    className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest text-center"
                                >
                                    Cancel & Downgrade to Starter
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">?</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Need a custom plan?</h4>
                        <p className="text-sm text-gray-500">Contact our sales team for enterprise solutions.</p>
                    </div>
                </div>
                <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                    Contact Sales
                </button>
            </div>

            {/* Upgrade Modal */}
            {upgradePlan && (
                <UpgradeModal
                    plan={upgradePlan}
                    currentUser={currentUser}
                    onConfirm={handleConfirmUpgrade}
                    onClose={() => setUpgradePlan(null)}
                />
            )}
        </div>
    );
};

export default Subscription;
