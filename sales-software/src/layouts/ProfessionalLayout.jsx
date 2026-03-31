import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    CheckCircle,
    DollarSign,
    Bell,
    User,
    LogOut,
    Menu,
    X,
    ShieldAlert,
    CreditCard,
    Zap,
    Map,
    MessageSquare,
    Star,
    Settings,
    Globe
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';
import { useMarketplace } from '../context/MarketplaceContext';
import Sidebar from '../components/Sidebar';
import useLocationTracker from '../hooks/useLocationTracker';

const ProfessionalLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, currentUser, toast, showToast, notifications, isAuthenticated, markNotificationRead, clearNotifications } = useMarketplace();
    const [notifMenuOpen, setNotifMenuOpen] = useState(false);
    const nRef = useRef(null);
    useLocationTracker(); // Initialize auto-tracking

    if (isAuthenticated === null) return null; // Wait for checkAuth
    if (isAuthenticated === false) return <Navigate to="/login" replace />;

    const unreadCount = (notifications || []).filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (nRef.current && !nRef.current.contains(event.target)) {
            setNotifMenuOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/professional/dashboard' },
        { icon: Briefcase, label: 'Leads', path: '/professional/leads' },
        // { icon: Map, label: 'Map View', path: '/professional/map' },
        { icon: MessageSquare, label: 'Messages', path: '/professional/messages' },
        { icon: Star, label: 'Reviews', path: '/professional/reviews' },
        { icon: CreditCard, label: 'Subscription', path: '/professional/subscription' },
        { icon: Bell, label: 'Notifications', path: '/professional/notifications' },
        { icon: Settings, label: 'Settings', path: '/professional/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                menuItems={menuItems}
                basePath="/professional"
                title="ProMarket"
                logo={Zap}
                themeColor="blue"
                bottomActions={[
                    {
                        icon: LogOut,
                        label: 'Logout',
                        danger: true,
                        onClick: () => setIsLogoutModalOpen(true)
                    }
                ]}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
                        >
                            <Menu size={20} className="sm:w-[22px]" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-[10px] sm:text-xs font-bold text-gray-900 uppercase tracking-widest truncate">
                                {menuItems.find(i => location.pathname.startsWith(i.path))?.label || 'Portal'}
                            </h1>
                            <p className="hidden xs:block text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-tighter truncate">Service Management Platform</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">


                        <div className="relative" ref={nRef}>
                            <button
                                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                            >
                                <Bell size={18} className="sm:w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            {notifMenuOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                        <h3 className="font-bold text-gray-900 text-sm">Action Alerts</h3>
                                        {unreadCount > 0 && (
                                            <button 
                                                onClick={clearNotifications}
                                                className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-tight"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                        {(notifications || []).length > 0 ? (
                                            notifications.map((n) => (
                                                <div 
                                                    key={n.id}
                                                    onClick={() => !n.isRead && markNotificationRead(n.id)}
                                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                                                >
                                                    {!n.isRead && (
                                                        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    )}
                                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{n.type || 'System'}</p>
                                                    <h4 className="text-xs font-bold text-gray-900 mb-1">{n.title}</h4>
                                                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{n.message}</p>
                                                    <p className="text-[9px] text-gray-400 mt-2 font-medium">
                                                        {new Date(n.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Bell size={20} className="text-gray-300" />
                                                </div>
                                                <p className="text-xs text-gray-400 font-medium">No new alerts</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
                                        <button onClick={() => { navigate('/professional/notifications'); setNotifMenuOpen(false); }} className="text-[11px] font-bold text-gray-500 hover:text-gray-900 underline transition-colors">
                                            View all activity
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate('/professional/settings')}>
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shadow-md shrink-0">
                                {currentUser?.name?.charAt(0) || 'P'}
                            </div>
                            <div className="hidden sm:block text-left min-w-0">
                                <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate max-w-[100px]">{currentUser?.name || 'Professional'}</p>
                                <p className="text-[10px] text-gray-400 truncate">{currentUser?.role === 'WORKER' ? 'Service Professional' : (currentUser?.role || 'Provider')}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 custom-scrollbar">
                    <div className="max-w-screen-2xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>
            </main>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Terminate Session"
                message="Are you sure you want to sign out of your professional account?"
                icon={ShieldAlert}
                confirmText="Sign Out"
                type="danger"
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => showToast(null)}
                />
            )}
        </div>
    );
};

export default ProfessionalLayout;
