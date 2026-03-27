import React from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = () => {
    return (
        <div className="bg-white p-2 sm:p-3 rounded-3xl sm:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col sm:flex-row items-center w-full max-w-4xl mx-auto border border-gray-100 gap-2 sm:gap-0">
            <div className="w-full sm:flex-1 flex items-center px-4 py-2 sm:py-0 sm:border-r border-gray-200 bg-gray-50 sm:bg-transparent rounded-2xl sm:rounded-none">
                <Search className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                <input
                    type="text"
                    placeholder="What service do you need?"
                    className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-lg"
                />
            </div>
            <div className="w-full sm:flex-1 flex items-center px-4 py-2 sm:py-0 bg-gray-50 sm:bg-transparent rounded-2xl sm:rounded-none">
                <MapPin className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                <input
                    type="text"
                    placeholder="Zip code or city"
                    className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-lg"
                />
            </div>
            <button className="w-full sm:w-auto mt-2 sm:mt-0 bg-brand-purple hover:bg-purple-700 text-white font-bold py-4 sm:py-3 px-10 rounded-2xl sm:rounded-full transition-all text-lg shadow-md hover:shadow-lg sm:ml-2">
                Search
            </button>
        </div>
    );
};

export default SearchBar;
