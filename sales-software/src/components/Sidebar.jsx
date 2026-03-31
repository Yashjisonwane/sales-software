import { Link, useLocation } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';

const Sidebar = ({
    isOpen,
    onClose,
    menuItems,
    basePath,
    title,
    logo: LogoIcon,
    themeColor = 'blue',
    bottomActions = []
}) => {
    const location = useLocation();

    return (
        <>
            {/* Mobile/Tablet overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col h-[100dvh] shrink-0 overflow-hidden
                ${isOpen
                    ? 'translate-x-0 w-72 shadow-2xl lg:shadow-none'
                    : '-translate-x-full w-0 shadow-none lg:translate-x-0 lg:border-none'
                }`}>
                {/* Logo */}
                <div className={`h-20 flex items-center px-6 border-b border-gray-50 shrink-0 overflow-hidden transition-all duration-300 ${isOpen ? 'justify-between' : 'justify-center w-0'}`}>
                    <Link 
                        to={`${basePath}/dashboard`} 
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center gap-4 group ${!isOpen ? 'pointer-events-none' : ''}`}
                    >
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-blue-100 group-hover:rotate-12 transition-transform duration-300 ${!isOpen && 'scale-0'}`}>
                            <LogoIcon size={20} className="text-white sm:w-[22px]" />
                        </div>
                        <span className={`font-bold text-gray-900 text-lg sm:text-xl tracking-tighter transition-all duration-300 whitespace-nowrap 
                            ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute pointer-events-none'}`}>
                            {title}
                        </span>
                    </Link>
                    {isOpen && (
                        <button
                            className="lg:hidden text-gray-400 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-xl transition-all"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Nav */}
                <nav className={`flex-1 px-3 sm:px-4 py-6 sm:py-8 space-y-1 sm:space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar transition-opacity duration-300 ${!isOpen ? 'opacity-0' : 'opacity-100'}`}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path || (item.path !== `${basePath}/dashboard` && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                title={!isOpen ? item.label : ''}
                                className={`flex items-center gap-4 px-3 sm:px-4 py-3 rounded-xl sm:rounded-2xl transition-all duration-300 group relative border-2 border-transparent ${active ? `bg-blue-600 text-white shadow-xl shadow-blue-100 border-blue-500/20` : `text-gray-400 hover:bg-gray-50 hover:text-gray-900`}`}
                            >
                                <Icon size={20} className={`shrink-0 transition-transform duration-300 sm:w-[22px] ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className={`font-bold text-sm whitespace-nowrap transition-all duration-300 
                                    ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute pointer-events-none'}`}>
                                    {item.label}
                                </span>
                                {item.badge > 0 && isOpen && (
                                    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-lg border-2 transition-all duration-300 bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-100 ${active ? `bg-white text-blue-600 border-white` : ``}`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className={`px-3 sm:px-4 pt-4 sm:pt-6 pb-20 lg:pb-6 border-t border-gray-50 space-y-1 sm:space-y-2 shrink-0 overflow-hidden flex flex-col bg-gray-50/30 transition-opacity duration-300 ${!isOpen ? 'opacity-0' : 'opacity-100'}`}>
                    {bottomActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={index}
                                onClick={action.onClick}
                                title={!isOpen ? action.label : ''}
                                className={`flex items-center gap-4 px-3 sm:px-4 py-3 rounded-xl sm:rounded-2xl transition-all duration-300 group w-full relative ${action.danger ? 'text-rose-500 hover:bg-rose-50 hover:text-rose-600' : `text-gray-400 hover:bg-white hover:text-gray-900 hover:shadow-sm`}`}
                            >
                                <Icon size={20} className="shrink-0 group-hover:rotate-12 transition-transform sm:w-[22px]" />
                                <span className={`font-bold text-sm whitespace-nowrap transition-all duration-300 
                                    ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 absolute pointer-events-none'}`}>
                                    {action.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
