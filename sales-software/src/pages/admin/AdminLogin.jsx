import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, User, Loader2, ShieldCheck, X } from 'lucide-react';
import LoginRoleSelector from '../../components/LoginRoleSelector';
import { useMarketplace } from '../../context/MarketplaceContext';
import { registerUser, resetPassword } from '../../services/apiService';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login, showToast } = useMarketplace();
    
    // Toggle between Login and Register
    const [isRegistering, setIsRegistering] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('admin@gmail.com');
    const [phone, setPhone] = useState('9999912345');
    const [password, setPassword] = useState('1234');
    
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Forgot Password State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [newPass, setNewPass] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            if (isRegistering) {
                // Register Flow
                const res = await registerUser({ name, email, phone, password, role: 'ADMIN' });
                if (res.success) {
                    showToast('Admin account created! Logging you in...', 'success');
                    // Automatically log them in
                    const loginRes = await login(email, password);
                    if (loginRes) navigate('/admin/dashboard');
                } else {
                    setError(res.error || 'Registration failed');
                }
            } else {
                // Login Flow
                const success = await login(email, password);
                if (success) {
                    navigate('/admin/dashboard');
                } else {
                    setError('Invalid email or password.');
                }
            }
        } catch (err) {
            setError('Server error.');
        }

        setIsLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsResetting(true);

        try {
            const res = await resetPassword(forgotEmail, newPass);
            if (res.success) {
                setSuccessMsg(res.message);
                setShowForgotModal(false);
                setForgotEmail('');
                setNewPass('');
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
            <div className="w-full max-w-md">
                {/* Logo / Title */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Zap size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">LeadMarket Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">{isRegistering ? 'Create Admin Account' : 'Admin Login'}</p>
                </div>

                <LoginRoleSelector activeRole="admin" />

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-2">
                    <form onSubmit={handleAuth} className="space-y-5">
                        
                        {isRegistering && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                                            placeholder="1234567890"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition-all text-sm"
                                    placeholder="admin@demo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                {!isRegistering && (
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(true)}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition-all text-sm"
                                    placeholder="admin123"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">{error}</p>
                        )}

                        {successMsg && (
                            <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">{successMsg}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${isLoading ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-md shadow-blue-200'}`}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isRegistering ? 'Create Admin Account' : 'Login')}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">
                            {isRegistering ? 'Already have an account? ' : "Don't have an admin account? "}
                        </span>
                        <button 
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                                setSuccessMsg('');
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                        >
                            {isRegistering ? 'Log in' : 'Register Now'}
                        </button>
                    </div>

                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForgotModal(false)} />
                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-in zoom-in duration-300">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Admin Reset</h2>
                            <p className="text-gray-500 text-xs mt-1">Set a new administrative password</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5 ml-1">Admin Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm transition-all outline-none focus:border-blue-500"
                                    placeholder="admin@example.com"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5 ml-1">New Password</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm transition-all outline-none focus:border-blue-500"
                                    placeholder="Enter new password"
                                    value={newPass}
                                    onChange={(e) => setNewPass(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={isResetting}
                                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isResetting ? <Loader2 className="animate-spin" size={16} /> : 'Reset Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(false)}
                                    className="w-full py-2 text-gray-400 text-xs font-medium hover:text-gray-600 transition-colors"
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

export default AdminLogin;
