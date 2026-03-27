import React from 'react';
import ReviewCard from './ReviewCard';

const reviewsData = [
    {
        name: "John Doe",
        rating: 5,
        text: "Excellent service! The plumber arrived on time and fixed the leak quickly. Highly recommended.",
        date: "2 days ago",
        service: "Plumbing",
        providerName: "Swift Flow Plumbing"
    },
    {
        name: "Jane Smith",
        rating: 4,
        text: "Very professional and courteous. The cleaning was thorough, though it took a bit longer than expected.",
        date: "1 week ago",
        service: "House Cleaning",
        providerName: "Sparkle & Shine Co."
    },
    {
        name: "Mike Johnson",
        rating: 5,
        text: "Great experience with the electrician. Friendly, knowledgeable, and the price was fair.",
        date: "3 days ago",
        service: "Electrical",
        providerName: "VoltMaster Solutions"
    },
    {
        name: "Sarah Williams",
        rating: 5,
        text: "The landscaping team did an amazing job. Our backyard looks completely transformed!",
        date: "5 days ago",
        service: "Landscaping",
        providerName: "Green Horizon Gardens"
    },
    {
        name: "Robert Brown",
        rating: 4,
        text: "Reliable and efficient. The HVAC tech explained everything clearly and got the system running perfectly.",
        date: "2 weeks ago",
        service: "HVAC",
        providerName: "Climate Control Experts"
    },
    {
        name: "Emily Davis",
        rating: 5,
        text: "Prompt and professional handyman service. Fixed multiple small issues in one visit. Very satisfied.",
        date: "1 month ago",
        service: "Handyman",
        providerName: "Reliable Repairs Inc."
    }
];

const ReviewsSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Customer Reviews</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Hear from our satisfied customers about their experiences with our professionals.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviewsData.map((review, index) => (
                        <ReviewCard
                            key={index}
                            name={review.name}
                            rating={review.rating}
                            text={review.text}
                            date={review.date}
                            service={review.service}
                            providerName={review.providerName}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
