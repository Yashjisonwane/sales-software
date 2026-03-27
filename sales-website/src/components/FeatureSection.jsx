import React from 'react';

const FeatureSection = ({ title, description, reverse = false, children }) => {
    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                    <div className="w-full lg:w-1/2 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            {title || "Why choose ServiceHub for your needs?"}
                        </h2>
                        <p className="text-lg text-gray-600">
                            {description || "We connect you with highly-rated professionals for any job, big or small. Book with confidence knowing all service providers are vetted."}
                        </p>
                        {children}
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="aspect-video bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center shadow-lg relative">
                            <div className="absolute inset-x-4 top-4 bottom-4 border-2 border-dashed border-blue-200 rounded-xl"></div>
                            <span className="text-blue-400 font-medium z-10 bg-blue-50 px-4">Feature Media Placeholder</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
