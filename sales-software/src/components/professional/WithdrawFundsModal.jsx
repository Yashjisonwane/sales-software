import React, { useState } from 'react';
import { X, DollarSign, Building, Smartphone, Loader2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

const WithdrawFundsModal = ({ isOpen, onClose, availableBalance, onWithdrawSuccess }) => {
    const { showToast } = useMarketplace();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('upi'); // 'upi' or 'bank'
    const [upiId, setUpiId] = useState('');
    const [accountParams, setAccountParams] = useState({ accountName: '', accountNumber: '', ifsc: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            showToast('Please enter a valid amount greater than 0.', 'error');
            return;
        }

        if (numAmount > availableBalance) {
            showToast('Cannot withdraw more than available balance.', 'error');
            return;
        }

        if (method === 'upi' && !upiId) {
            showToast('Please enter your UPI ID.', 'error');
            return;
        }

        if (method === 'bank' && (!accountParams.accountName || !accountParams.accountNumber || !accountParams.ifsc)) {
            showToast('Please fill in all bank details.', 'error');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            showToast(`Successfully initiated withdrawal of $${numAmount.toFixed(2)}`, 'success');
            if (onWithdrawSuccess) {
                onWithdrawSuccess(numAmount);
            }
            onClose();
            // Reset form
            setAmount('');
            setUpiId('');
            setAccountParams({ accountName: '', accountNumber: '', ifsc: '' });
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                            <DollarSign size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Withdraw Funds</h2>
                            <p className="text-xs text-gray-400 font-medium">Available: <span className="text-emerald-600 font-bold">${availableBalance.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Amount */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amount ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    max={availableBalance}
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800 font-bold text-lg"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Method Selection */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Withdrawal Method</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMethod('upi')}
                                    className={`flex items-center justify-center gap-2 py-3 border rounded-xl font-bold text-sm transition-all ${method === 'upi' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <Smartphone size={16} /> UPI
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMethod('bank')}
                                    className={`flex items-center justify-center gap-2 py-3 border rounded-xl font-bold text-sm transition-all ${method === 'bank' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <Building size={16} /> Bank Transfer
                                </button>
                            </div>
                        </div>

                        {/* Method Specific Fields */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                            {method === 'upi' ? (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">UPI ID</label>
                                    <input
                                        type="text"
                                        required={method === 'upi'}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-800 text-sm"
                                        placeholder="example@upi"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Account Name</label>
                                        <input
                                            type="text"
                                            required={method === 'bank'}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-800 text-sm mb-3"
                                            placeholder="John Doe"
                                            value={accountParams.accountName}
                                            onChange={(e) => setAccountParams({ ...accountParams, accountName: e.target.value })}
                                        />
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Account Number</label>
                                        <input
                                            type="text"
                                            required={method === 'bank'}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-800 text-sm mb-3 font-mono"
                                            placeholder="000012345678"
                                            value={accountParams.accountNumber}
                                            onChange={(e) => setAccountParams({ ...accountParams, accountNumber: e.target.value })}
                                        />
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Routing Number / IFSC</label>
                                        <input
                                            type="text"
                                            required={method === 'bank'}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-800 text-sm font-mono uppercase"
                                            placeholder="ABCD0123456"
                                            value={accountParams.ifsc}
                                            onChange={(e) => setAccountParams({ ...accountParams, ifsc: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
                                className={`flex-1 flex justify-center items-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold transition-all text-sm shadow-md ${isSubmitting || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700 active:scale-95 shadow-emerald-200'
                                    }`}
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm & Withdraw'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WithdrawFundsModal;
