import { useState } from 'react';
import { Bell, Calendar, Clock, DollarSign, AlertCircle, Send, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import ConfirmationModal from '../../components/ConfirmationModal';

const Reminders = () => {
    const { sales, showToast } = useData();
    const [activeTab, setActiveTab] = useState('list');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [settings, setSettings] = useState({
        oneDay: false,
        twoDays: false,
        threeDays: true,
        email: true,
        whatsapp: true,
        template: 'Hello {Customer Name},\nYour payment of {Amount} is due on {Due Date}.\nPlease complete the payment.'
    });

    const pendingPayments = sales.filter(s => s.status === 'Pending');
    const totalOwed = pendingPayments.reduce((sum, s) => sum + s.amount, 0);

    const handleSaveSettings = () => {
        showToast('Reminder settings saved successfully!', 'success');
    };

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Reminders</h1>
                    <p className="text-sm text-gray-500 font-medium">Configure and manage automated payment notifications</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Bell size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Reminders</p>
                        <p className="text-xl font-bold text-gray-800">{pendingPayments.length} Items</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Outstanding</p>
                        <p className="text-xl font-bold text-gray-800">${totalOwed.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'list' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Outstanding Payments
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Reminder Settings
                </button>
            </div>

            {activeTab === 'list' ? (
                <div className="space-y-4 animate-in fade-in duration-500">
                    {pendingPayments.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-400 rounded-2xl mb-4">
                                <Bell size={32} />
                            </div>
                            <h3 className="font-bold text-gray-700 text-lg">All caught up!</h3>
                            <p className="text-gray-400 text-sm mt-1">No outstanding payments require reminders.</p>
                        </div>
                    ) : pendingPayments.map((payment) => (
                        <div key={payment.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center font-black text-lg border border-amber-100 group-hover:scale-105 transition-transform">
                                        {payment.customer.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{payment.customer}</h3>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1 font-bold uppercase tracking-tight">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} className="text-gray-400" />
                                                {payment.dueDate}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign size={12} className="text-gray-400" />
                                                ${payment.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedPayment(payment);
                                        setIsConfirmModalOpen(true);
                                    }}
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-xs font-bold shadow-md shadow-blue-100 active:scale-95 whitespace-nowrap"
                                >
                                    <Send size={14} />
                                    Send Reminder
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500 max-w-3xl">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                        <h2 className="font-bold text-gray-800 uppercase text-[10px] tracking-widest">Automation Configuration</h2>
                    </div>
                    <div className="p-6 md:p-8 space-y-8">
                        {/* Timing */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-blue-600" />
                                Send Reminder Before Due Date
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { id: 'oneDay', label: '1 Day Before' },
                                    { id: 'twoDays', label: '2 Days Before' },
                                    { id: 'threeDays', label: '3 Days Before' }
                                ].map(item => (
                                    <label
                                        key={item.id}
                                        className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-all has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={settings[item.id]}
                                            onChange={(e) => setSettings({ ...settings, [item.id]: e.target.checked })}
                                            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Channels */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <Send size={18} className="text-blue-600" />
                                Reminder Channels
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { id: 'email', label: 'Email Notifications' },
                                    { id: 'whatsapp', label: 'WhatsApp Message' }
                                ].map(item => (
                                    <label
                                        key={item.id}
                                        className="flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-all has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={settings[item.id]}
                                            onChange={(e) => setSettings({ ...settings, [item.id]: e.target.checked })}
                                            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Template */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-blue-600" />
                                Message Template
                            </h3>
                            <div className="space-y-3">
                                <textarea
                                    value={settings.template}
                                    onChange={(e) => setSettings({ ...settings, template: e.target.value })}
                                    rows="5"
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-gray-700 resize-none leading-relaxed"
                                ></textarea>
                                <div className="flex flex-wrap gap-2">
                                    {['{Customer Name}', '{Amount}', '{Due Date}', '{Product Name}'].map(tag => (
                                        <button
                                            key={tag}
                                            className="px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-[10px] font-bold text-gray-500 rounded-full transition-colors border border-gray-200 hover:border-blue-200"
                                            onClick={() => setSettings({ ...settings, template: settings.template + ' ' + tag })}
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 flex justify-end">
                            <button
                                onClick={handleSaveSettings}
                                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-100 active:scale-95"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => {
                    showToast(`Reminder sent to ${selectedPayment?.customer}`, 'success');
                    setIsConfirmModalOpen(false);
                }}
                title="Send Payment Reminder"
                message={`Send a payment reminder to ${selectedPayment?.customer} for $${selectedPayment?.amount?.toLocaleString()}?`}
                icon={Send}
                confirmText="Send Now"
                type="info"
            />
        </div>
    );
};

export default Reminders;
