import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
                <span className="text-[#7C3AED] font-black uppercase tracking-[0.2em] text-[11px]">Security Governance Protocol</span>
                <h1 className="text-3xl md:text-4xl font-black text-[#111827] mt-4 tracking-tight leading-tight">Data Integrity for Every <br className="hidden md:block"/> Lead & Professional</h1>
                <p className="text-[#6B7280] mt-6 text-[15px] md:text-base font-medium leading-relaxed max-w-2xl mx-auto">This Privacy Policy defines how we manage transactional leads and user metadata to maintain the highest standard of service integrity across our ecosystem.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#F3F4F6] p-8 md:p-14 space-y-12">
                <section>
                    <h2 className="text-xl md:text-2xl font-black text-[#111827] mb-6 tracking-tight">1. Lead Collection & Purpose</h2>
                    <p className="text-[#4B5563] leading-relaxed font-medium text-[15px] md:text-base">We collect essential request data (name, email, phone, and geographic location) solely to match your needs with a qualified professional in our verified service marketplace.</p>
                </section>

                <section>
                    <h2 className="text-xl md:text-2xl font-black text-[#111827] mb-6 tracking-tight">2. Professional Metadata Governance</h2>
                    <p className="text-[#4B5563] leading-relaxed font-medium text-[15px] md:text-base">For our service providers, we maintain secure records of your business credentials, availability, and service history to optimize the marketplace's efficiency and trust levels.</p>
                </section>

                <section>
                    <h2 className="text-xl md:text-2xl font-black text-[#111827] mb-6 tracking-tight">3. Secure Distribution Mechanisms</h2>
                    <p className="text-[#4B5563] leading-relaxed font-medium text-[15px] md:text-base">Lead transmission is isolated using encrypted protocols. We do not sell datasets to external advertising brokerage entities. Your data is used only for fulfilling the specific service request at hand.</p>
                </section>

                <div className="bg-[#F9FAFB] p-8 md:p-10 rounded-3xl border border-[#F3F4F6] text-center">
                    <p className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-[0.2em] mb-4">Protocol Version 4.0</p>
                    <h3 className="text-base md:text-lg font-black text-[#111827] tracking-tight">Updated March 2026</h3>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
