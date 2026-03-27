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
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 text-center space-y-6">
                    <div className={`w-16 h-16 ${colors[type] || colors.info} text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-2`}>
                        <Icon size={32} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                        <p className="text-gray-500 mt-2 text-sm leading-relaxed">{message}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-6 py-3 ${colors[type] || colors.info} text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-md`}
                        >
                            <span>{confirmText}</span>
                            <ArrowRight size={16} />
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
