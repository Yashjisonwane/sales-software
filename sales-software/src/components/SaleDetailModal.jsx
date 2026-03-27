import { X, DollarSign, Calendar, User, Package, CheckCircle, Clock } from 'lucide-react';

const SaleDetailModal = ({ isOpen, onClose, sale }) => {
    if (!isOpen || !sale) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Package size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Sale Details</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Transaction ID: {sale.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                                <DollarSign className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Amount</p>
                                <h4 className="text-2xl font-bold text-gray-900">${sale.amount.toLocaleString()}</h4>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${sale.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {sale.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-gray-400">
                                <User size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">Customer</span>
                            </div>
                            <p className="font-bold text-gray-800">{sale.customer}</p>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Package size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">Product/Service</span>
                            </div>
                            <p className="font-bold text-gray-800">{sale.product}</p>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">Due Date</span>
                            </div>
                            <p className="font-bold text-gray-800">{sale.dueDate}</p>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Clock size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">Verification</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-500" />
                                <p className="text-sm font-bold text-emerald-600">System Verified</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-gray-200"
                        >
                            Close Detail
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaleDetailModal;
