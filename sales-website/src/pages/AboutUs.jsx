import React from 'react';

const AboutUs = () => {
    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 px-4">
                <span className="text-[#7C3AED] font-black uppercase tracking-[0.2em] text-[11px]">The Lead Hub Marketplace</span>
                <h1 className="text-4xl md:text-5xl font-black text-[#111827] mt-4 tracking-tighter leading-[1.1]">Connecting Local Experts <br className="hidden md:block"/> with Every Request</h1>
                <p className="text-[#6B7280] mt-6 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">We provide a state-of-the-art lead management ecosystem designed to streamline how jobs are captured, distributed, and finalized by professional service providers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="bg-[#F9FAFB] p-8 md:p-14 rounded-[2.5rem] border border-[#F3F4F6]">
                    <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-6 tracking-tight">Our Ecosystem Vision</h2>
                    <p className="text-[#4B5563] font-medium leading-[1.6] mb-8 text-[15px] md:text-base">
                        Our platform serves as the central brain for local businesses. By transforming a simple service request into a structured lead, we ensure that no job is lost and every professional has the data they need to provide world-class service. 
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#F3F4F6]">
                            <h3 className="text-2xl md:text-3xl font-black text-[#7C3AED]">Real-time</h3>
                            <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest mt-1">Lead Distribution</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#F3F4F6]">
                            <h3 className="text-2xl md:text-3xl font-black text-[#7C3AED]">Verified</h3>
                            <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest mt-1">Professional Network</p>
                        </div>
                    </div>
                </div>
                <div className="relative group">
                    <div className="aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                        <img 
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
                            alt="Professional Service" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-20 md:mt-32">
                <div className="bg-[#111827] text-white rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8">Ready to grow your service empire?</h2>
                        <button className="bg-[#7C3AED] hover:bg-[#6D28D9] px-10 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.1em] transition-all transform hover:translate-y-[-2px] active:scale-95 shadow-xl shadow-[#7C3AED]/20">Start a Request Now</button>
                    </div>
                    {/* Premium Decorative Glows */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C3AED] opacity-30 blur-[120px] -mr-40 -mt-40"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4F46E5] opacity-20 blur-[120px] -ml-40 -mb-40"></div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
