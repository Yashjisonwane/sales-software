import React from 'react';
import { Map, MapPin } from 'lucide-react';

const LeadMap = ({ leads, className = '' }) => {
    return (
        <div className={`bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative flex flex-col items-center justify-center min-h-[400px] ${className}`}>
            {/* Fallback Map Interface */}
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <Map className="h-16 w-16 text-slate-400 mb-4 z-10" />
            <h3 className="text-lg font-medium text-slate-700 z-10">Google Maps Integration Required</h3>
            <p className="text-sm text-slate-500 max-w-sm text-center mt-2 z-10">
                This is a placeholder component for the Lead Map view. A valid Google Maps API key is required to render the actual map component.
            </p>

            {/* Mock Map Markers for illustration */}
            {leads && leads.slice(0, 3).map((lead, index) => {
                // Generate pseudo-random positions based on array index to show markers
                const top = 20 + (index * 25) + '%';
                const left = 20 + ((index * 30) % 60) + '%';

                return (
                    <div
                        key={lead.id}
                        className="absolute z-20 flex flex-col items-center"
                        style={{ top, left }}
                        title={`${lead.customerName} - ${lead.serviceCategory}`}
                    >
                        <div className="bg-white shadow-md rounded-md px-2 py-1 text-xs font-bold whitespace-nowrap mb-1">
                            {lead.serviceCategory}
                        </div>
                        <MapPin className="h-8 w-8 text-blue-600 fill-white" />
                    </div>
                );
            })}
        </div>
    );
};

export default LeadMap;
