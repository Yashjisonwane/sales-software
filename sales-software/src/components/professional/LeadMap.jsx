import React from 'react';

const LeadMap = ({ className = '' }) => {
    return (
        <div className={`relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 ${className}`}>
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29447.82891851613!2d75.86119679999999!3d22.69184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1775022608974!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
            ></iframe>
            
            {/* Branding Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Live Service Area</span>
            </div>
        </div>
    );
};

export default LeadMap;
