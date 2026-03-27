import React, { useState, useEffect } from 'react';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Github,
    Chrome,
    ShieldCheck,
    Briefcase,
    ChevronLeft,
    Eye,
    EyeOff
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const LoginSignup = () => {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('customer'); // 'customer' or 'professional'
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Switch to signup mode if accessed via /signup
        if (location.pathname === '/signup') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [location.pathname]);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`${isLogin ? 'Login' : 'Signup'} successful!`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-[#7C3AED]/70 transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#7C3AED]/5 border border-gray-100 overflow-hidden animate-slide-up">
                    {/* Card Header */}
                    <div className="bg-gray-900 p-8 text-center text-white relative">
                        <div className="absolute inset-0 bg-[#7C3AED]/5 pointer-events-none"></div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">
                            {isLogin ? 'Welcome Back' : 'Join ServiceHub'}
                        </h2>
                        <p className="text-gray-400 text-sm font-medium">
                            {isLogin ? 'Sign in to access your dashboard' : 'Create an account to get started'}
                        </p>
                    </div>

                    {/* Role Selector Tabs */}
                    <div className="flex p-1 bg-gray-100 mx-4 sm:mx-8 mt-8 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setRole('customer')}
                            className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-bold transition-all ${role === 'customer' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <User className="w-4 h-4 mr-2" />
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('professional')}
                            className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-bold transition-all ${role === 'professional' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Briefcase className="w-4 h-4 mr-2" />
                            Professional
                        </button>
                    </div>

                    <div className="p-8 pb-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-medium"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-medium"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
                                    {isLogin && (
                                        <button type="button" className="text-xs font-bold text-[#7C3AED] hover:underline">
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#7C3AED] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-[#7C3AED]/20 flex items-center justify-center group active:scale-[0.98]"
                            >
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        {/* Social Logins */}
                        <div className="mt-8">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-gray-400">
                                    <span className="bg-white px-4">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" className="flex items-center justify-center py-4 px-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                                    <Chrome className="w-5 h-5 mr-3 text-orange-500" />
                                    Google
                                </button>
                                <button type="button" className="flex items-center justify-center py-4 px-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                                    <Github className="w-5 h-5 mr-3 text-gray-900" />
                                    Github
                                </button>
                            </div>
                        </div>

                        {/* Toggle Flow Link */}
                        <p className="mt-10 text-center text-sm font-bold text-gray-400">
                            {isLogin ? "New to ServiceHub?" : "Already have an account?"}{' '}
                            <Link
                                to={isLogin ? "/signup" : "/login"}
                                className="text-[#7C3AED] hover:underline"
                            >
                                {isLogin ? 'Create one now' : 'Sign in here'}
                            </Link>
                        </p>
                    </div>

                    {/* Footer Trust Signal */}
                    <div className="bg-gray-50 py-4 px-8 border-t border-gray-100 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Secure 256-bit SSL Encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
