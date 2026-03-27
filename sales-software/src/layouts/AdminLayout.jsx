import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, FolderOpen, MapPin, CreditCard, BarChart2, Settings, LogOut, Menu, X, ShieldAlert, Bell, Zap, Activity, Navigation, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../context/DataContext';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { notifications, toast, showToast } = useData();
    const location = useLocation();
    const navigate = useNavigate();

    const unreadCount = notifications.filter(n => n.unread).length;

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Briefcase, label: 'Leads', path: '/admin/leads' },
        { icon: ClipboardList, label: 'Jobs', path: '/admin/jobs' },
        { icon: Users, label: 'Professionals', path: '/admin/professionals' },
        { icon: Activity, label: 'Live Tracking', path: '/admin/live-tracking' },
        // { icon: Navigation, label: 'Nearby Pros', path: '/admin/nearby' },
        { icon: FolderOpen, label: 'Categories', path: '/admin/categories' },
        { icon: MapPin, label: 'Locations', path: '/admin/locations' },
        { icon: CreditCard, label: 'Subscriptions', path: '/admin/subscriptions' },
        { icon: BarChart2, label: 'Reports', path: '/admin/reports' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                menuItems={menuItems}
                basePath="/admin"
                title="LeadMarket"
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
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
                        >
                            <Menu size={20} className="sm:w-[22px]" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                                {menuItems.find(i => location.pathname.startsWith(i.path))?.label ||
                                    (location.pathname === '/admin/settings' ? 'Settings' : 'Marketplace Admin')}
                            </h1>
                            <p className="hidden xs:block text-[10px] sm:text-xs text-gray-400 truncate">Service Management Platform</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {/* Demo Role Switcher */}
                        <button 
                            onClick={() => navigate('/professional/dashboard')}
                            className="hidden xs:flex items-center gap-2 px-3 py-1.5 bg-slate-900/5 hover:bg-slate-900/10 text-slate-600 rounded-full border border-slate-200 transition-all active:scale-95"
                        >
                            <Briefcase size={14} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Pro Dashboard</span>
                        </button>

                        <button
                            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            onClick={() => navigate('/admin/reminders')}
                        >
                            <Bell size={18} className="sm:w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate('/admin/settings')}>
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shadow-md shrink-0">
                                A
                            </div>
                            <div className="hidden sm:block text-left min-w-0">
                                <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate max-w-[100px]">Admin</p>
                                <p className="text-[10px] text-gray-400 truncate">System Root</p>
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
                onConfirm={() => navigate('/login')}
                title="Terminate Session"
                message="Are you sure you want to terminate your current administrative session? You will need to re-authenticate to access the management terminal."
                icon={ShieldAlert}
                confirmText="Terminate Session"
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

export default AdminLayout;
