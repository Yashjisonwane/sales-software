import { X, CheckCircle, AlertCircle, ArrowRight, Download, Send } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, icon: Icon = CheckCircle, confirmText = "Confirm", type = "info" }) => {
    if (!isOpen) return null;

    const colors = {
        info: "bg-blue-600 shadow-blue-200",
        success: "bg-emerald-600 shadow-emerald-200",
        warning: "bg-amber-600 shadow-amber-200",
        danger: "bg-rose-600 shadow-rose-200"
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
                <div className="p-6 sm:p-8 text-center space-y-6 overflow-y-auto custom-scrollbar">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 ${colors[type] || colors.info} text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-2 transform transition-transform hover:rotate-6`}>
                        <Icon size={28} className="sm:w-8 sm:h-8" />
                    </div>

                    <div className="px-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
                        <p className="text-gray-500 mt-2 text-xs sm:text-sm leading-relaxed font-medium">{message}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 px-6 py-3.5 border border-gray-100 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`w-full sm:flex-1 px-6 py-3.5 ${colors[type] || colors.info} text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2`}
                        >
                            <span>{confirmText}</span>
                            <ArrowRight size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
