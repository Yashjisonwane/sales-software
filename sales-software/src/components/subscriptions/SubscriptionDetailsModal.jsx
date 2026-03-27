import React from 'react';
import { X, User, Briefcase, CreditCard, Calendar, CheckCircle } from 'lucide-react';

const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
};

const DetailRow = ({ icon: Icon, label, value, iconColor = 'text-gray-400' }) => (
    <div className="flex items-center gap-3">
        <div className={iconColor}><Icon size={16} /></div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{value || '—'}</p>
        </div>
    </div>
);

const SubscriptionDetailsModal = ({ isOpen, onClose, subscription }) => {
    if (!isOpen || !subscription) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between px-8 pt-8 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                            <CreditCard size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Subscription Overview</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Professional Enrollment Log</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-8 pb-8 pt-4 space-y-6">
                    <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${subscription.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {subscription.status} Enrollment
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Professional</p>
                            <p className="text-sm font-bold text-gray-900">{subscription.name}</p>
                        </div>
                        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assigned Plan</p>
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-tight">{subscription.plan}</p>
                        </div>
                        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Billing Amount</p>
                            <p className="text-sm font-bold text-gray-900">{subscription.amount}</p>
                        </div>
                        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Enrollment Date</p>
                            <p className="text-sm font-bold text-gray-900">{subscription.date}</p>
                        </div>
                    </div>

                    {subscription.featureList && subscription.featureList.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Active Entitlements</p>
                            <div className="grid grid-cols-1 gap-2">
                                {subscription.featureList.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight italic">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={onClose} className="w-full py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all text-sm shadow-sm active:scale-[0.98]">
                        Dismiss Overview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDetailsModal;
