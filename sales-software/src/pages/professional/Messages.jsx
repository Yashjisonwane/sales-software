import React, { useState, useEffect } from 'react';
import ChatWindow from '../../components/professional/ChatWindow';
import { Search, MessageSquare } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLocation } from 'react-router-dom';

const Messages = () => {
    const { chats, activeChatMessages, fetchChatMessages, sendChatMessage, leads, assignments, currentUser, refreshData } = useMarketplace();
    const location = useLocation();
    const [activeChat, setActiveChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Dynamic Conversations logic ---
    // Extract all leads that have been assigned to this professional (any status)
    const assignedLeads = leads.filter(lead => {
        const assignment = assignments.find(a => a.leadId === lead.id && a.professionalId === currentUser?.id);
        const status = (assignment?.status || '').toLowerCase();
        // Include any lead that isn't 'rejected'
        return status !== 'rejected' && assignment !== undefined;
    });

    // Merge actual chats with leads to ensure all customers are visible
    const allConversations = assignedLeads.map(lead => {
        const assignment = assignments.find(a => a.leadId === lead.id && a.professionalId === currentUser?.id);
        const jobId = assignment?.id;
        
        // Find if an actual chat record exists for this job
        const dbChat = chats.find(c => c.jobId === jobId);
        
        if (dbChat) {
            return {
                ...dbChat,
                isVirtual: false,
                leadNo: lead.leadNo || lead.id,
                time: dbChat.time || lead.dateRequested || new Date().toISOString()
            };
        } else {
            // Virtual chat fallback for new or legacy jobs
            return {
                id: jobId, // Use jobId as fallback ID for sending logic
                isVirtual: true,
                jobId: jobId,
                leadId: lead.leadNo || lead.id,
                customerName: lead.customerName,
                service: lead.serviceCategory,
                lastMessage: 'Ready for consultation',
                time: lead.dateRequested || new Date().toISOString(),
                unread: 0,
                status: 'offline'
            };
        }
    });

    // Sync active chat if location state suggests a specific job
    useEffect(() => {
        if (location.state?.jobId && allConversations.length > 0) {
            const foundChat = allConversations.find(c => c.jobId === location.state.jobId);
            if (foundChat) {
                setActiveChat(foundChat);
            }
        }
    }, [location.state?.jobId, chats, assignments]);

    // Fetch messages when active chat changes
    useEffect(() => {
        if (activeChat) {
            fetchChatMessages(activeChat.id);
        }
    }, [activeChat]);

    // Sync virtual to real chat transition seamlessly
    useEffect(() => {
        if (activeChat?.isVirtual) {
            const realChat = chats.find(c => c.jobId === activeChat.jobId);
            if (realChat) {
               setActiveChat(prev => ({ ...realChat, leadNo: prev.leadNo }));
            }
        }
    }, [chats, activeChat]);

    const handleSendMessage = async (text) => {
        if (!activeChat) return;
        
        const success = await sendChatMessage(activeChat.id, text);
        if (success) {
            // Once sent, the virtual chat will naturally become a real one 
            // after the global data refresh happens in MarketplaceContext
            refreshData(); 
        }
    };

    const filteredChats = allConversations
        .filter(c => 
            (c.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.service || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.time) - new Date(a.time));

    // UI Formatting for messages
    const formattedMessages = activeChatMessages.map(m => ({
        text: m.text,
        sender: m.senderId === currentUser?.id ? 'professional' : 'customer',
        time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'
    }));

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden animate-in fade-in duration-500">
            {/* Sidebar Conversation List */}
            <div className="w-full md:w-80 lg:w-96 shrink-0 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-bold text-gray-700 shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredChats.map(chat => (
                    <div
                        key={chat.id}
                        onClick={() => setActiveChat(chat)}
                        className={`p-6 border-b border-gray-50 cursor-pointer hover:bg-blue-50/30 transition-all relative flex items-center gap-4 group ${activeChat?.id === chat.id ? 'bg-blue-50/50' : ''}`}
                    >
                        {activeChat?.id === chat.id && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-blue-600 rounded-r-full"></div>
                        )}
                        <div className="relative">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center font-black text-gray-400 shadow-inner border border-white group-hover:scale-110 transition-transform duration-300">
                                {chat.customerName?.charAt(0) || 'C'}
                            </div>
                            {chat.status === 'online' && (
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <h4 className={`text-sm font-black truncate tracking-tight ${chat.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{chat.customerName}</h4>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest shrink-0">
                                    {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex flex-col gap-0.5 mb-1.5">
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 w-max px-1.5 py-0.5 rounded tracking-wide">Lead #{chat.leadNo || chat.leadId}</span>
                                <span className="text-[10px] font-bold text-gray-500 truncate">{chat.service}</span>
                            </div>
                            <p className={`text-xs truncate leading-relaxed ${chat.unread > 0 ? 'text-blue-600 font-black' : 'text-gray-400 font-medium'}`}>{chat.lastMessage || 'Ready to chat'}</p>
                        </div>
                    </div>
                ))}
                {filteredChats.length === 0 && (
                    <div className="p-12 text-center text-gray-400 mt-10">
                        <MessageSquare size={48} className="mx-auto mb-3 opacity-10" />
                        <p className="text-sm font-bold uppercase tracking-widest">No active chats</p>
                    </div>
                )}
            </div>
        </div>

        {/* Chat Window Component */}
        <div className="flex-1 overflow-hidden relative">
            {activeChat ? (
                <ChatWindow
                    customerName={activeChat.customerName}
                    messages={formattedMessages} // Always pass messages even if virtual (logic handles state)
                    onSendMessage={handleSendMessage}
                />
            ) : (
                <div className="h-full bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                        <div className="h-24 w-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                            <MessageSquare size={40} className="opacity-20" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Select a consultation</h3>
                        <p className="text-xs md:text-sm font-medium max-w-xs mt-2 leading-relaxed">Choose a contact back from the sidebar to continue your professional consultation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
