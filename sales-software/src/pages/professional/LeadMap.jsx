import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import LeadMapComponent from '../../components/professional/LeadMap';
import LeadCard from '../../components/professional/LeadCard';
import { MapPin } from 'lucide-react';

const LeadMap = () => {
    const [selectedLead, setSelectedLead] = useState(null);
    const { leads, assignments, currentUser, respondToLead } = useMarketplace();

    // Get leads assigned to this professional
    const myAssignments = assignments.filter(a => a.professionalId === currentUser.id);
    const myAssignedLeadIds = myAssignments.map(a => a.leadId);
    const myLeads = leads.filter(l => myAssignedLeadIds.includes(l.id));

    // Combine lead data with assignment status for the map
    const displayLeads = myLeads.map(l => {
        const assignment = myAssignments.find(a => a.leadId === l.id);
        return { ...l, status: assignment.status };
    });

    const handleAction = (type, lead) => {
        const assignment = myAssignments.find(a => a.leadId === lead.id);
        if (assignment && (type === 'accept' || type === 'reject')) {
            respondToLead(assignment.id, type);
            setSelectedLead(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col space-y-6 pb-20 lg:pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Lead Explorer</h1>
                    <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">Visualize and manage opportunities in your vicinity.</p>
                </div>
                <div className="flex flex-wrap gap-4 px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-[10px] font-black uppercase tracking-widest w-full md:w-auto">
                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm shadow-red-200"></span> New Lead</div>
                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm shadow-green-200"></span> Accepted</div>
                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-gray-400 shadow-sm shadow-gray-100"></span> Closed</div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6">
                {/* Map View */}
                <div className="flex-1 rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white h-[400px] lg:h-auto">
                    <LeadMapComponent
                        leads={displayLeads}
                        onPinClick={(lead) => setSelectedLead(lead)}
                        className="h-full"
                    />
                </div>

                {/* Info Panel / Selected Lead */}
                <div className="w-full lg:w-80 shrink-0 space-y-4">
                    <h3 className="font-bold text-gray-900 text-lg px-1">Selected Lead</h3>
                    {selectedLead ? (
                        <div className="animate-in slide-in-from-bottom-4 duration-300">
                            <LeadCard
                                lead={displayLeads.find(l => l.id === selectedLead.id) || selectedLead}
                                onAction={handleAction}
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400 flex flex-col items-center justify-center h-48 lg:h-64">
                            <p className="text-sm font-medium">Click a pin on the map to see lead details.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default LeadMap;
