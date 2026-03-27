import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    };

    const textColors = {
        success: 'text-green-800',
        error: 'text-red-800',
        info: 'text-blue-800'
    };

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        info: 'text-blue-500'
    };

    const Icons = {
        success: CheckCircle,
        error: XCircle,
        info: CheckCircle
    };

    const Icon = Icons[type];

    return (
        <div className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl ${bgColors[type]} min-w-[300px]`}>
                <div className={`shrink-0 ${iconColors[type]}`}>
                    <Icon size={20} />
                </div>
                <div className="flex-1">
                    <p className={`text-sm font-medium ${textColors[type]}`}>{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
