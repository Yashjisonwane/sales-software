import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

const initialForm = {
    customerName: '',
    serviceCategory: '',
    location: '',
    zipCode: '',
    customerPhone: '',
    customerEmail: '',
    description: '',
    preferredDate: '',
};

const AddLeadModal = ({ isOpen, onClose, onAdd, existingLeads }) => {
    const { categories } = useMarketplace();
    const [form, setForm] = useState(initialForm);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nextId = `L${String(existingLeads.length + 1).padStart(3, '0')}`;
        
        // Find category name if ID was used, or vice versa
        // Current lead model might expect serviceCategory as a string
        const categoryObj = categories.find(c => c.id === form.serviceCategory || c.name === form.serviceCategory);
        
        const newLead = {
            id: nextId,
            customerName: form.customerName,
            customerEmail: form.customerEmail,
            customerPhone: form.customerPhone,
            serviceCategory: categoryObj ? categoryObj.name : form.serviceCategory,
            categoryId: categoryObj ? categoryObj.id : null,
            description: form.description,
            location: form.location,
            zipCode: form.zipCode,
            latitude: 0,
            longitude: 0,
            status: 'Open',
            urgency: 'Medium',
            budget: '',
            preferredDate: form.preferredDate,
            assignedTo: null,
            assignedProfessionals: [],
            dateRequested: new Date().toISOString(),
            photos: [],
        };
        onAdd(newLead);
        setForm(initialForm);
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
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                            <Plus size={22} />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Add New Lead</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                    {/* Customer Name */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Customer Name</label>
                        <input
                            name="customerName"
                            value={form.customerName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-inter"
                            placeholder="e.g. John Doe"
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
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
                        >
                            <option value="">Select a service...</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location & Zip row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Location / Address</label>
                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="e.g. 123 Main St, Springfield"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">ZIP Code</label>
                            <input
                                name="zipCode"
                                value={form.zipCode}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="90210"
                            />
                        </div>
                    </div>

                    {/* Phone & Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Phone</label>
                            <input
                                name="customerPhone"
                                value={form.customerPhone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="555-1234"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                            <input
                                name="customerEmail"
                                type="email"
                                value={form.customerEmail}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="john@email.com"
                            />
                        </div>
                    </div>

                    {/* Preferred Date */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Preferred Date</label>
                        <input
                            name="preferredDate"
                            type="date"
                            value={form.preferredDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none shadow-inner"
                            placeholder="Describe the service request..."
                        />
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
                            className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl shadow-blue-100"
                        >
                            <Plus size={16} />
                            <span>Add Lead</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLeadModal;
