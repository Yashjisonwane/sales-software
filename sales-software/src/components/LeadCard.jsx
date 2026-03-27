import React from 'react';
import { MapPin, Clock, DollarSign, Calendar } from 'lucide-react';

const LeadCard = ({ lead, onAction, actionLabel = "View Details" }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'open': return 'bg-blue-100 text-blue-800';
            case 'assigned': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency.toLowerCase()) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-orange-600 bg-orange-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{lead.serviceCategory} Service</h3>
                    <p className="text-sm text-gray-500">Requested by {lead.customerName}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                </span>
            </div>

            <p className="text-gray-700 text-sm mb-4 line-clamp-2">{lead.description}</p>

            <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    {lead.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    <span className={`px-2 py-0.5 rounded text-xs mr-2 border ${getUrgencyColor(lead.urgency)}`}>
                        {lead.urgency} Urgency
                    </span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                        <DollarSign size={16} className="mr-2 text-gray-400" />
                        {lead.budget}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={14} className="mr-1 text-gray-400" />
                        {new Date(lead.dateRequested).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <button
                onClick={() => onAction && onAction(lead)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium text-sm transition-colors"
            >
                {actionLabel}
            </button>
        </div>
    );
};

export default LeadCard;
