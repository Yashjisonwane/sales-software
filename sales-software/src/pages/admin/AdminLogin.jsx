import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, Loader2 } from 'lucide-react';
import LoginRoleSelector from '../../components/LoginRoleSelector';

const DUMMY_CREDS = { email: 'admin@demo.com', password: 'admin123' };

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        let currentEmail = email;
        let currentPassword = password;

        // If fields are empty, auto-fill with dummy credentials
        if (!currentEmail || !currentPassword) {
            currentEmail = DUMMY_CREDS.email;
            currentPassword = DUMMY_CREDS.password;
            setEmail(currentEmail);
            setPassword(currentPassword);
        }

        if (currentEmail !== DUMMY_CREDS.email || currentPassword !== DUMMY_CREDS.password) {
            setError('Invalid credentials.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            navigate('/admin/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
            <div className="w-full max-w-md">
                {/* Logo / Title */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Zap size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">LeadMarket Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Admin Login</p>
                </div>


                {/* Role Selector */}
                <LoginRoleSelector activeRole="admin" />

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-2">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800 placeholder:text-gray-300 text-sm"
                                    placeholder="admin@demo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800 placeholder:text-gray-300 text-sm"
                                    placeholder="admin123"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${isLoading ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-md shadow-blue-200'}`}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                'Login as Admin'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

