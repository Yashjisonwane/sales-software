import React from 'react';
import { Star, Briefcase, MapPin } from 'lucide-react';

const ReviewCard = ({ review }) => {
    const name = (review.customerName || review.author || '').trim() || 'Guest';
    const comment = (review.comment || '').trim();
    const service = (review.serviceName || review.serviceCategory || '').trim() || '—';
    const location = (review.locationName || '').trim() || '—';
    const jobRef = review.jobNo && review.jobNo !== '—' ? `#${review.jobNo}` : null;

    const ratingVal = Number(review.rating) || 0;

    return (
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300 group">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center font-black text-sm text-blue-600 shadow-inner border border-white shrink-0">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="font-black text-gray-900 tracking-tight leading-snug text-sm break-words" title={name}>
                            {name}
                        </h4>
                        <div className="flex items-center gap-0.5 flex-wrap">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={11}
                                    className={`${
                                        i < Math.round(ratingVal) ? 'text-amber-400 fill-current' : 'text-gray-200'
                                    }`}
                                />
                            ))}
                            <span className="text-[9px] font-bold text-gray-400 ml-0.5 tabular-nums">{ratingVal.toFixed(1)}</span>
                        </div>

                        <div className="space-y-1 text-[11px] leading-tight pt-0.5">
                            <p className="flex items-start gap-1.5 text-gray-700 font-medium min-w-0">
                                <Briefcase size={12} className="shrink-0 text-blue-500 mt-px" />
                                <span className="min-w-0">
                                    <span className="text-[9px] font-black uppercase tracking-wide text-gray-400">Service · </span>
                                    <span className="break-words">{service}</span>
                                </span>
                            </p>
                            <p className="flex items-start gap-1.5 text-gray-700 font-medium min-w-0">
                                <MapPin size={12} className="shrink-0 text-emerald-500 mt-px" />
                                <span className="min-w-0">
                                    <span className="text-[9px] font-black uppercase tracking-wide text-gray-400">Loc · </span>
                                    <span className="break-words leading-snug line-clamp-3">{location}</span>
                                </span>
                            </p>
                        </div>

                        {jobRef && (
                            <span className="inline-block text-[9px] font-black uppercase tracking-wide text-blue-600 bg-blue-50/90 px-1.5 py-0.5 rounded">
                                Job {jobRef}
                            </span>
                        )}
                    </div>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide shrink-0 sm:text-right whitespace-nowrap">
                    {review.date
                        ? new Date(review.date).toLocaleDateString(undefined, {
                              month: 'short',
                              year: 'numeric',
                              day: 'numeric',
                          })
                        : '—'}
                </span>
            </div>

            <div className="relative flex-1 min-h-0 mb-1.5">
                <p className="text-gray-600 text-xs leading-relaxed font-medium relative z-10 line-clamp-4">
                    {comment ? (
                        <>“{comment}”</>
                    ) : (
                        <span className="text-gray-400 italic">No written feedback.</span>
                    )}
                </p>
                <div className="absolute -top-1 -left-0.5 text-2xl text-gray-100 font-serif z-0 select-none pointer-events-none leading-none">
                    “
                </div>
            </div>

            <div className="mt-auto pt-2.5 border-t border-gray-100 flex items-center justify-end">
                <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-wide whitespace-nowrap">
                    <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
                    Verified
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
