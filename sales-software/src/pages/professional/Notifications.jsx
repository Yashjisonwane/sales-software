import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Bell, CheckCircle, Briefcase, DollarSign, Clock, Mail } from 'lucide-react';

const Notifications = () => {
    const { notifications, markNotificationRead, setNotifications } = useMarketplace();

    const markAllRead = () => {
        if (setNotifications) {
            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'lead': return <Briefcase size={20} className="text-blue-600" />;
            case 'job': return <CheckCircle size={20} className="text-green-600" />;
            case 'payment': return <DollarSign size={20} className="text-purple-600" />;
            default: return <Bell size={20} className="text-gray-600" />;
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-sm text-gray-500 mt-1">Stay updated with leads, job status, and payments.</p>
                </div>
                <button
                    onClick={markAllRead}
                    className="text-sm font-bold text-blue-600 hover:underline"
                >
                    Mark all as read
                </button>
            </div>

            <div className="space-y-3">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start ${notif.unread ? 'bg-white border-blue-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-75'}`}
                    >
                        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${notif.unread ? 'bg-blue-50' : 'bg-gray-100'}`}>
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-bold text-gray-900 ${notif.unread ? '' : 'font-semibold text-gray-700'}`}>{notif.title}</h3>
                                <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                    <Clock size={10} /> {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{notif.message}</p>
                        </div>
                        {notif.unread && (
                            <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shadow-sm shadow-blue-200"></div>
                        )}
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400">
                        <Mail size={48} className="mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No notifications yet. We'll keep you posted!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
