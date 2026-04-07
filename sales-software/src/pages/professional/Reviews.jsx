import { useMarketplace } from '../../context/MarketplaceContext';
import ReviewCard from '../../components/professional/ReviewCard';
import { Star, MessageSquare, ThumbsUp, TrendingUp, Filter, Search } from 'lucide-react';

const formatPct = (p) => {
    const n = Number(p);
    if (Number.isNaN(n)) return '0';
    return (Math.round(n * 10) / 10).toFixed(1);
};

const Reviews = () => {
    const { reviews, reviewStats } = useMarketplace();
    const averageRating = reviewStats.averageRating || 0;
    const totalReviews = reviews.length;

    const ratingBreakdown = reviewStats.distribution || [
        { stars: 5, percentage: 0 },
        { stars: 4, percentage: 0 },
        { stars: 3, percentage: 0 },
        { stars: 2, percentage: 0 },
        { stars: 1, percentage: 0 },
    ];

    return (
        <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 lg:pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Customer Feedback</h1>
                    <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">Manage your professional reputation and respond to customer reviews.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                </div>
            </div>

            {/* Summary Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Star size={100} className="text-gray-900 fill-current md:size-[120px]" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-2 leading-none tracking-tighter tabular-nums">
                        {Number(averageRating || 0).toFixed(1)}
                    </h2>
                    <div className="flex items-center justify-center gap-1.5 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 md:h-6 md:w-6 text-amber-400 fill-current drop-shadow-sm" />
                        ))}
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Overall Rating</p>
                    <div className="mt-6 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black flex items-center gap-2">
                        <TrendingUp size={14} /> 4.2% Increase this month
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-gray-100">
                    <h3 className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Rating Distribution</h3>
                    <div className="space-y-4">
                        {ratingBreakdown.map((row) => {
                            const pct = Math.min(100, Math.max(0, Number(row.percentage) || 0));
                            const pctLabel = formatPct(pct);
                            return (
                                <div key={row.stars} className="flex items-center gap-2 md:gap-3 min-w-0">
                                    <div className="w-8 md:w-10 shrink-0 flex items-center gap-0.5">
                                        <span className="text-sm font-black text-gray-700 tabular-nums">{row.stars}</span>
                                        <Star size={12} className="text-amber-400 fill-current shrink-0" />
                                    </div>
                                    <div className="flex-1 min-w-0 h-2.5 md:h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-1000 delay-300 max-w-full"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="w-11 sm:w-12 shrink-0 text-right tabular-nums text-[10px] md:text-xs font-black text-gray-500">
                                        {pctLabel}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-400">
                        <div className="flex items-center gap-2"><ThumbsUp size={14} className="text-blue-500" /> 98% Recommend you</div>
                        <div className="flex items-center gap-2 text-gray-900"><MessageSquare size={14} className="text-blue-500" /> {totalReviews} Total Reviews</div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Testimonials</h2>
                <button className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-wider hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 sm:bg-transparent sm:p-0 sm:border-0">
                    <Filter size={14} /> Sort: Newest First
                </button>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
                {reviews.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400">
                        <Star size={48} className="mx-auto mb-3 opacity-10" />
                        <p className="font-bold">No reviews yet. Complete your first job to get feedback!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
