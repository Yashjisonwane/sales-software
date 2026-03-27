import React from 'react';
import { Search, MapPin } from 'lucide-react';

const ServiceSearchBar = ({ onSearch }) => {
    const [service, setService] = React.useState('');
    const [location, setLocation] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch({ service, location });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white rounded-xl md:rounded-lg shadow-xl md:shadow-md p-2 flex flex-col md:flex-row items-center gap-1 md:gap-2">
            <div className="flex-1 relative w-full border-b md:border-b-0 md:border-r border-gray-100 md:border-gray-200">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3.5 md:py-3 border-transparent focus:outline-none focus:ring-0 text-sm md:text-sm text-gray-900 placeholder-gray-400 md:placeholder-gray-500 rounded-md"
                    placeholder="Service (e.g. Plumbing)"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                />
            </div>

            <div className="flex-1 relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border-transparent focus:outline-none focus:ring-0 sm:text-sm text-gray-900 placeholder-gray-500 rounded-md"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            <div className="w-full md:w-auto mt-2 md:mt-0 px-2 shrink-0">
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-150 ease-in-out"
                >
                    Search
                </button>
            </div>
        </form>
    );
};

export default ServiceSearchBar;
