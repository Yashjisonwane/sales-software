import React from 'react';
import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => {
    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-xl transition-all duration-500 group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center font-black text-gray-400 shadow-inner border border-white group-hover:scale-110 transition-transform duration-300">
                        {review.customerName ? review.customerName.charAt(0) : 'C'}
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 tracking-tight leading-none mb-1">{review.customerName}</h4>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    className={`${i < Math.floor(review.rating)
                                        ? 'text-amber-400 fill-current'
                                        : 'text-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic flex items-center gap-2">
                    <div className="h-0.5 w-4 bg-gray-100 sm:hidden"></div>
                    {new Date(review.date).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                </span>
            </div>

            <div className="relative">
                <p className="text-gray-500 text-sm leading-relaxed font-medium relative z-10">
                    "{review.comment}"
                </p>
                <div className="absolute -top-4 -left-2 text-5xl md:text-6xl text-gray-50 font-serif z-0 select-none">"</div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                    {review.serviceCategory || 'Handyman'}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest whitespace-nowrap">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    Verified Order
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
