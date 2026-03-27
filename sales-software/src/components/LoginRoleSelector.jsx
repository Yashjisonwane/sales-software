import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ShieldCheck } from 'lucide-react';

const LoginRoleSelector = ({ activeRole }) => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'admin',
            label: 'Admin',
            icon: ShieldCheck,
            path: '/login',
            color: 'slate'
        },
        {
            id: 'professional',
            label: 'Professional',
            icon: Briefcase,
            path: '/professional/login',
            color: 'indigo'
        }
    ];

    return (
        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl gap-1 mb-6 border border-gray-200/50 backdrop-blur-sm shadow-sm">
            {roles.map((role) => {
                const Icon = role.icon;
                const isActive = activeRole === role.id;

                return (
                    <button
                        key={role.id}
                        onClick={() => {
                            localStorage.setItem('selectedRole', role.id);
                            navigate(role.path);
                        }}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300
                            ${isActive
                                ? 'bg-white text-blue-600 shadow-md shadow-blue-100/50 scale-[1.02]'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }
                        `}
                    >
                        <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                        <span className="hidden sm:inline">{role.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default LoginRoleSelector;
