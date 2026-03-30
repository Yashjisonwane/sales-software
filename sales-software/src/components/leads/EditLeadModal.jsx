import React, { useState, useEffect } from 'react';
import { X, Save, Edit } from 'lucide-react';

const serviceOptions = [
    'Plumbing', 'Electrical', 'Cleaning', 'HVAC',
    'Roofing', 'Painting', 'Handyman', 'Landscaping',
];

const statusOptions = ['Open', 'Assigned', 'Completed'];

const EditLeadModal = ({ isOpen, onClose, lead, onSave }) => {
    const [form, setForm] = useState({
        customerName: '',
        serviceCategory: '',
        location: '',
        status: '',
    });

    useEffect(() => {
        if (lead) {
            setForm({
                customerName: lead.customerName || '',
                serviceCategory: lead.serviceCategory || '',
                location: lead.location || '',
                status: lead.status || 'Open',
            });
        }
    }, [lead]);

    if (!isOpen || !lead) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...lead, ...form });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-8 pt-6 sm:pt-8 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-200 shrink-0">
                            <Edit size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Edit Lead</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">#{lead.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Customer Name */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Customer Name</label>
                        <input
                            name="customerName"
                            value={form.customerName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Service Category */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Service Category</label>
                        <select
                            name="serviceCategory"
                            value={form.serviceCategory}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                        >
                            <option value="">Select a service...</option>
                            {serviceOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Location / Address</label>
                        <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                        >
                            {statusOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-50 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl shadow-amber-100"
                        >
                            <Save size={16} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLeadModal;
