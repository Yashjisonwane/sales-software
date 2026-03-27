import { X, Save, Zap, Users, DollarSign, Calendar, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const SaleModal = ({ isOpen, onClose, title, type = 'sale' }) => {
    const { addSale, addCustomer } = useData();
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen) {
            setFormData({}); // Reset on open
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === 'sale') {
            addSale({
                customer: formData.customerName,
                product: formData.product,
                amount: parseFloat(formData.amount),
                dueDate: formData.dueDate,
                status: 'Pending'
            });
        } else {
            addCustomer({
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                company: formData.company
            });
        }
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${type === 'sale' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            {type === 'sale' ? <Zap size={20} /> : <Users size={20} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Please fill in the details below</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {type === 'sale' ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Customer Name *</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input required name="customerName" onChange={handleChange} value={formData.customerName || ''} type="text" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium" placeholder="e.g. Globex Corp" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Product/Service *</label>
                                        <div className="relative">
                                            <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input required name="product" onChange={handleChange} value={formData.product || ''} type="text" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium" placeholder="Cloud Infrastructure" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Amount ($) *</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input required name="amount" onChange={handleChange} value={formData.amount || ''} type="number" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-bold" placeholder="0.00" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Due Date *</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input required name="dueDate" onChange={handleChange} value={formData.dueDate || ''} type="date" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                                        <input required name="fullName" onChange={handleChange} value={formData.fullName || ''} type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                                        <input required name="email" onChange={handleChange} value={formData.email || ''} type="email" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium" placeholder="john@enterprise.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                                        <input required name="phone" onChange={handleChange} value={formData.phone || ''} type="tel" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium" placeholder="+1 (888) 000-0000" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Company</label>
                                        <input name="company" onChange={handleChange} value={formData.company || ''} type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium" placeholder="Global Strategic LLC" />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Additional Notes</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                                <textarea name="notes" onChange={handleChange} value={formData.notes || ''} rows="3" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium resize-none" placeholder="Add any relevant information..."></textarea>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-50">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm"
                            >
                                <Save size={18} />
                                <span>Save {type === 'sale' ? 'Sale' : 'Customer'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SaleModal;
