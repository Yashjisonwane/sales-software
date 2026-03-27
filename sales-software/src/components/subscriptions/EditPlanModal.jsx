import React, { useState, useEffect } from 'react';
import { X, Save, Edit, Check } from 'lucide-react';

const EditPlanModal = ({ isOpen, onClose, plan, onSave }) => {
    const [form, setForm] = useState({
        name: '',
        price: '',
        leadsLimit: '',
        features: {
            priority: false,
            support: 'Email',
            premiumAccess: false
        },
        featureList: []
    });
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        if (plan) {
            setForm({
                name: plan.name || '',
                price: plan.price || '',
                leadsLimit: plan.leadsLimit || '',
                features: plan.features || {
                    priority: false,
                    support: 'Email',
                    premiumAccess: false
                },
                featureList: plan.featureList || []
            });
        }
    }, [plan]);

    if (!isOpen || !plan) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('feat_')) {
            const featName = name.replace('feat_', '');
            setForm(prev => ({
                ...prev,
                features: { ...prev.features, [featName]: type === 'checkbox' ? checked : value }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...plan, ...form });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between px-8 pt-8 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                            <Edit size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Configure {plan.name} Tier</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Plan Settings & Features</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Plan Name</label>
                            <input name="name" value={form.name} onChange={handleChange} required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price / Month</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                                <input name="price" value={form.price} onChange={handleChange} required
                                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Leads Limit (Per Month)</label>
                        <input name="leadsLimit" value={form.leadsLimit} onChange={handleChange} required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                            placeholder="e.g. 50 or Unlimited" />
                    </div>

                    <div className="space-y-4 pt-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Toggle Entitlements</p>

                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-blue-200 cursor-pointer transition-all group">
                                <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600 transition-colors">Priority Listing</span>
                                <input type="checkbox" name="feat_priority" checked={form.features.priority} onChange={handleChange}
                                    className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                            </label>

                            <label className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-blue-200 cursor-pointer transition-all group">
                                <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600 transition-colors">Premium Access</span>
                                <input type="checkbox" name="feat_premiumAccess" checked={form.features.premiumAccess} onChange={handleChange}
                                    className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                            </label>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Service Support Level</label>
                            <select name="feat_support" value={form.features.support} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                                <option value="Email Support">Basic Email Support</option>
                                <option value="Priority Support">Priority Support (24h)</option>
                                <option value="24/7 Dedicated Support">24/7 Dedicated Support</option>
                            </select>
                        </div>
                    </div>

                    {/* Dynamic Plan Features Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dynamic Features</p>
                        
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Add custom feature..."
                            />
                            <button 
                                type="button"
                                onClick={() => {
                                    if (newFeature.trim() && !form.featureList.includes(newFeature.trim())) {
                                        setForm(prev => ({ ...prev, featureList: [...prev.featureList, newFeature.trim()] }));
                                        setNewFeature('');
                                    }
                                }}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                            >
                                Add
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {form.featureList.map((feature, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 group animate-in slide-in-from-left-2 duration-200 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">{feature}</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, featureList: prev.featureList.filter((_, i) => i !== idx) }))}
                                        className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 sticky bottom-0 bg-white/80 backdrop-blur-sm">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3.5 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all text-sm">Cancel</button>
                        <button type="submit" className="flex-2 px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-blue-100">
                            <Save size={18} /><span>Apply Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPlanModal;
