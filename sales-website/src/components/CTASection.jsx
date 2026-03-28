import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background with SaaS-style highlights */}
            <div className="absolute inset-0 bg-gray-900">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-[#4F46E5] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-16 text-center shadow-2xl">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 font-semibold text-sm mb-8 border border-purple-500/20">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Ready to get started?
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                        Need Help With a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]">Service?</span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of satisfied homeowners. Our verified professionals are ready to help you with any task, big or small.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <Link
                            to="/request-service"
                            className="w-full sm:w-auto px-10 py-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black rounded-full text-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transform hover:-translate-y-1 uppercase tracking-widest"
                        >
                            Request Service
                        </Link>
                        <Link
                            to="/contact"
                            className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/20 text-white font-bold rounded-full text-xl hover:bg-white/5 transition-all"
                        >
                            Talk to Support
                        </Link>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500 text-sm font-medium">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-[#7C3AED] rounded-full mr-2"></div>
                            Verified Professionals
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-[#7C3AED] rounded-full mr-2"></div>
                            Secure Patterns
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-[#7C3AED] rounded-full mr-2"></div>
                            Happiness Guaranteed
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
