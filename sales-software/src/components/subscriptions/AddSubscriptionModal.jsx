import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const initialForm = {
    professional: '',
    business: '',
    plan: '',
    amount: '',
    date: '',
    status: 'Active',
    featureList: []
};

const AddSubscriptionModal = ({ isOpen, onClose, onAdd, plans = [] }) => {
    const [form, setForm] = useState(initialForm);
    const [newFeature, setNewFeature] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'plan') {
            const selectedPlan = plans.find(p => p.name === value);
            setForm(prev => ({ 
                ...prev, 
                plan: value, 
                amount: selectedPlan ? `$${selectedPlan.price}` : '',
                featureList: selectedPlan ? [...(selectedPlan.featureList || [])] : []
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newSub = {
            id: `SUB-${Date.now()}`,
            name: form.professional,
            business: form.business,
            plan: form.plan,
            amount: form.amount,
            date: form.date || new Date().toISOString().slice(0, 10),
            status: form.status,
            featureList: form.featureList
        };
        onAdd(newSub);
        setForm(initialForm);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between px-8 pt-8 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                            <Plus size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">New Subscription</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Enroll Professional into Plan</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Professional Name *</label>
                        <input name="professional" value={form.professional} onChange={handleChange} required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Full name of the professional" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Business Name</label>
                        <input name="business" value={form.business} onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Company or agency name" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Plan *</label>
                            <select name="plan" value={form.plan} onChange={handleChange} required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                                <option value="">Select tier...</option>
                                {plans.map(p => <option key={p.id} value={p.name}>{p.name} — ${p.price}/mo</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Billing Amount</label>
                            <input name="amount" value={form.amount} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="$0.00" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
                            <input name="date" type="date" value={form.date} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Initial Status</label>
                            <select name="status" value={form.status} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                                <option value="Active">Active</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Feature List Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Plan Entitlements</label>
                        <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
                            <input 
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (newFeature.trim() && !form.featureList.includes(newFeature.trim())) {
                                            setForm(prev => ({ ...prev, featureList: [...prev.featureList, newFeature.trim()] }));
                                            setNewFeature('');
                                        }
                                    }
                                }}
                                className="flex-1 px-3 py-2 bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
                                placeholder="Add custom entitlement..."
                            />
                            <button 
                                type="button"
                                onClick={() => {
                                    if (newFeature.trim() && !form.featureList.includes(newFeature.trim())) {
                                        setForm(prev => ({ ...prev, featureList: [...prev.featureList, newFeature.trim()] }));
                                        setNewFeature('');
                                    }
                                }}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2"
                            >
                                <Plus size={14} strokeWidth={3} />
                                Add
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                            {form.featureList.length > 0 ? (
                                form.featureList.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-gray-100 animate-in slide-in-from-left-4 duration-300 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                                                <Plus size={14} strokeWidth={3} />
                                            </div>
                                            <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">{f}</span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setForm(prev => ({ ...prev, featureList: prev.featureList.filter((_, idx) => idx !== i) }))}
                                            className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">No entitlements added yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 sticky bottom-0 bg-white/80 backdrop-blur-sm">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3.5 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all text-sm">Cancel</button>
                        <button type="submit" className="flex-2 px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-blue-100">
                            <Plus size={18} /><span>Create Enrollment</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubscriptionModal;
