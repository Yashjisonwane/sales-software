import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const SearchBar = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [postcode, setPostcode] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/leads/categories`);
                setCategories(res.data.data || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCats();
    }, []);

    const filteredCategories = searchTerm 
        ? categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : categories;

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('query', searchTerm);
        if (postcode) params.append('postcode', postcode);
        navigate(`/request-service?${params.toString()}`);
    };

    const handleSelectCategory = (catName) => {
        setSearchTerm(catName);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto mt-8">
            <div className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row items-center border border-gray-100 gap-2 sm:gap-0">
                {/* Service Search */}
                <div className="w-full sm:flex-[1.5] flex items-center px-6 py-3 sm:py-0 sm:border-r border-gray-100 bg-gray-50/50 sm:bg-transparent rounded-xl sm:rounded-none relative group">
                    <Search className="text-gray-400 w-5 h-5 mr-4 shrink-0 group-focus-within:text-[#7C3AED] transition-colors" />
                    <input
                        type="text"
                        placeholder="What service do you need?"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-lg font-medium"
                    />
                    
                    {/* Autocomplete Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden max-h-72 overflow-y-auto transform animate-in fade-in slide-in-from-top-2">
                             <div className="px-4 py-3 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-[#7C3AED] border-b border-gray-100 flex justify-between items-center">
                                <span>{searchTerm ? 'Suggested Services' : 'All Services'}</span>
                                <span className="bg-purple-100 text-[#7C3AED] px-2 py-0.5 rounded text-[8px]">{categories.length} Total</span>
                             </div>
                             {filteredCategories.length > 0 ? (
                                filteredCategories.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleSelectCategory(cat.name)}
                                        className="w-full px-6 py-4 text-left hover:bg-purple-50 flex items-center justify-between group transition-colors"
                                    >
                                        <span className="font-bold text-gray-700 group-hover:text-[#7C3AED]">{cat.name}</span>
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-[#7C3AED]" />
                                    </button>
                                ))
                             ) : (
                                <div className="px-6 py-8 text-center">
                                    <p className="text-gray-400 font-medium italic">No matching services found</p>
                                </div>
                             )}
                        </div>
                    )}
                </div>

                {/* Postcode */}
                <div className="w-full sm:flex-1 flex items-center px-6 py-3 sm:py-0 bg-gray-50/50 sm:bg-transparent rounded-xl sm:rounded-none">
                    <MapPin className="text-gray-400 w-5 h-5 mr-4 shrink-0" />
                    <input
                        type="text"
                        placeholder="Postcode"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-lg font-medium"
                    />
                </div>

                {/* Submit */}
                <button 
                    onClick={handleSearch}
                    className="w-full sm:w-auto h-[60px] sm:h-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black py-4 px-12 rounded-xl sm:rounded-full transition-all text-sm uppercase tracking-[0.2em] shadow-lg hover:shadow-[#7C3AED]/30 active:scale-95"
                >
                    Search
                </button>
            </div>
            
            {showSuggestions && (
                <div 
                    className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]" 
                    onClick={() => setShowSuggestions(false)}
                />
            )}
        </div>
    );
};

export default SearchBar;
