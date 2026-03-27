import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const ReviewCard = ({ name, date, service, text, rating, providerName }) => {
    return (
        <div className="bg-white p-8 rounded-3xl card-shadow hover-lift border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-gray-900 text-lg">{name || "Michael S."}</h4>
                    <div className="flex flex-col mt-1">
                        <p className="text-xs text-gray-500">Service: <span className="font-semibold text-gray-700">{service || "Electrical Repair"}</span></p>
                        <p className="text-xs text-gray-500">Provider: <span className="text-blue-600 font-semibold">{providerName || "Elite Spark Services"}</span></p>
                    </div>
                </div>
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (rating || 5) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                    ))}
                </div>
            </div>
            <div className="relative">
                <span className="absolute -top-2 -left-2 text-4xl text-blue-100 font-serif leading-none">"</span>
                <p className="text-gray-600 text-sm leading-relaxed relative z-10 pl-2">
                    {text || "Absolutely fantastic service. Showed up on time, fixed the issue quickly, and left the workspace cleaner than it was before."}
                </p>
            </div>
            <div className="mt-4 flex justify-between items-center border-t border-gray-50 pt-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{date || "October 14, 2025"}</span>
                <div className="flex items-center text-[10px] text-[#7C3AED] font-bold bg-purple-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Hire
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
