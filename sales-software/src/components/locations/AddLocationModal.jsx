import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const initialForm = {
    city: '',
    state: '',
    country: 'USA',
    professionals: '',
    leads: '',
    status: 'Active',
};

const AddLocationModal = ({ isOpen, onClose, onAdd }) => {
    const [form, setForm] = useState(initialForm);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: form.city, // Backend requires name, using city as display name
            city: form.city,
            state: form.state || '',
            country: form.country || 'USA',
            status: form.status,
        };
        onAdd(payload);
        setForm(initialForm);
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-2 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Plus size={22} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">New Service Area (City)</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 space-y-4 overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">City Name *</label>
                        <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
                            placeholder="e.g. Indore, Mumbai, Delhi..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">State</label>
                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
                                placeholder="e.g. CA"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Country</label>
                            <input
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
                                placeholder="e.g. USA"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Professionals</label>
                            <input
                                name="professionals"
                                type="number"
                                min="0"
                                value={form.professionals}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Active Leads</label>
                            <input
                                name="leads"
                                type="number"
                                min="0"
                                value={form.leads}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Initial Status</label>
                        <div className="flex gap-2">
                            {['Active', 'Inactive'].map((st) => (
                                <button
                                    key={st}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, status: st }))}
                                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                                        form.status === st 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                                        : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                                    }`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 sticky bottom-0 bg-white">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="w-full sm:flex-1 px-6 py-3.5 border border-gray-100 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="w-full sm:flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
                        >
                            <Plus size={16} strokeWidth={3} />
                            <span>Add Area</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLocationModal;
