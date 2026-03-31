import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Bell, CheckCircle, Briefcase, DollarSign, Clock, Mail, Zap, X } from 'lucide-react';

const Notifications = () => {
    const { notifications, markNotificationRead, clearNotifications } = useMarketplace();

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'lead': return <Briefcase size={20} className="text-blue-600" />;
            case 'job': return <CheckCircle size={20} className="text-green-600" />;
            case 'payment': return <DollarSign size={20} className="text-purple-600" />;
            case 'system': return <Zap size={20} className="text-yellow-600" />;
            default: return <Bell size={20} className="text-gray-600" />;
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Activity Center</h1>
                    <p className="text-sm text-gray-500 mt-1">Review all system notifications and performance alerts.</p>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={clearNotifications}
                        className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-widest flex items-center gap-2 border border-red-50 to-red-100 px-4 py-2 rounded-xl transition-colors bg-red-50/30"
                    >
                        <X size={14} /> Clear All
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {(notifications || []).map(notif => (
                    <div
                        key={notif.id}
                        onClick={() => !notif.isRead && markNotificationRead(notif.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start ${!notif.isRead ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-50' : 'bg-gray-50/50 border-gray-100 opacity-80 hover:opacity-100'}`}
                    >
                        <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center shadow-inner ${!notif.isRead ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${!notif.isRead ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                                        {notif.type || 'System'}
                                    </span>
                                    <h3 className={`font-bold text-gray-900 truncate ${!notif.isRead ? '' : 'text-gray-700 font-semibold'}`}>{notif.title}</h3>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 whitespace-nowrap">
                                    <Clock size={10} /> {new Date(notif.createdAt).toLocaleDateString([], { dateStyle: 'short' })} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{notif.message}</p>
                        </div>
                        {!notif.isRead && (
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-600 mt-2 shadow-[0_0_10px_rgba(37,99,235,0.4)] animate-pulse"></div>
                        )}
                    </div>
                ))}

                {(notifications || []).length === 0 && (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No notifications</h3>
                        <p className="text-gray-400 max-w-xs mx-auto">You're all caught up! New alerts will appear here as they happen.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
