import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Mail, Lock, Loader2, Zap, X, ShieldCheck } from 'lucide-react';
import LoginRoleSelector from '../../components/LoginRoleSelector';
import { useMarketplace } from '../../context/MarketplaceContext';
import useLocationTracker from '../../hooks/useLocationTracker';
import * as apiService from '../../services/apiService';

const ProfessionalLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('pro@market.com');
    const [password, setPassword] = useState('pro123');
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { login } = useMarketplace();
    const { requestPermission } = useLocationTracker();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        try {
            const success = await login(email, password);
            if (success) {
                requestPermission();
                navigate('/professional/dashboard');
            } else {
                setError('Invalid credentials or account suspended.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsResetting(true);

        try {
            const res = await apiService.resetPassword(forgotEmail, newPassword);
            if (res.success) {
                setSuccessMsg(res.message);
                setShowForgotModal(false);
                setForgotEmail('');
                setNewPassword('');
            } else {
                setError(res.error || 'Password reset failed.');
            }
        } catch (err) {
            setError('Server error during password reset.');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans text-gray-900">
            <div className="w-full max-w-md">
                {/* Logo / Title */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Zap size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">ProMarket</h1>
                    <p className="text-gray-500 text-sm mt-1">Professional Portal Login</p>
                </div>

                <LoginRoleSelector activeRole="professional" />

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
                                    placeholder="pro@demo.com"
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
                                    onClick={() => setShowForgotModal(true)}
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
                                    placeholder="pro123"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                                {typeof error === 'string' ? error : 'An error occurred.'}
                            </p>
                        )}

                        {successMsg && (
                            <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                                {successMsg}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${isLoading ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-md shadow-blue-200'}`}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                'Login as Professional'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForgotModal(false)} />
                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-800">Reset Password</h2>
                            <p className="text-gray-500 text-xs mt-1">Enter your email and new password</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={isResetting}
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isResetting ? 'Updating...' : 'Update Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(false)}
                                    className="w-full py-2 text-gray-500 text-sm hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalLogin;

