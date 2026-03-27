import React, { useState } from 'react';
import ChatWindow from '../../components/professional/ChatWindow';
import { Search, MessageSquare } from 'lucide-react';

const Messages = () => {
    // Mock conversations
    const [conversations, setConversations] = useState([
        { id: 1, name: 'Alice Smith', leadId: 'L002', service: 'Electrical Service', lastMsg: 'I have some leaks...', time: '10:30 AM', unread: 2, status: 'online' },
        { id: 2, name: 'Bob Johnson', leadId: 'L005', service: 'Plumbing Service', lastMsg: 'Great, thanks for helping!', time: '9:15 AM', unread: 0, status: 'offline' },
        { id: 3, name: 'Carol White', leadId: 'L012', service: 'Deep Cleaning', lastMsg: 'How much for the deep cleaning?', time: 'Yesterday', unread: 0, status: 'online' },
    ]);

    const [activeChat, setActiveChat] = useState(conversations[0]);
    const [chatMessages, setChatMessages] = useState({
        1: [
            { text: 'Hi, I need a professional for my kitchen leaks.', sender: 'customer', time: '10:00 AM' },
            { text: 'Hello Alice! I can help with that. Could you share some photos?', sender: 'professional', time: '10:15 AM' },
            { text: 'Sure, I will upload them in a minute.', sender: 'customer', time: '10:20 AM' },
        ],
        2: [
            { text: 'Bob, the job is done!', sender: 'professional', time: 'Yesterday' },
            { text: 'Great, thanks for helping!', sender: 'customer', time: '9:15 AM' },
        ],
        3: [
            { text: 'How much for the deep cleaning?', sender: 'customer', time: 'Yesterday' },
        ]
    });

    const handleSendMessage = (text) => {
        const newMessage = {
            text,
            sender: 'professional',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => ({
            ...prev,
            [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
        }));

        // Update last message in sidebar
        setConversations(prev => prev.map(c =>
            c.id === activeChat.id ? { ...c, lastMsg: text, time: 'Just now' } : c
        ));
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden animate-in fade-in duration-500">
            {/* Sidebar - Conversation List */}
            <div className="w-full md:w-80 lg:w-96 shrink-0 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-bold text-gray-700 shadow-inner"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversations.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat)}
                            className={`p-6 border-b border-gray-50 cursor-pointer hover:bg-blue-50/30 transition-all relative flex items-center gap-4 group ${activeChat.id === chat.id ? 'bg-blue-50/50' : ''}`}
                        >
                            {activeChat.id === chat.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-blue-600 rounded-r-full"></div>
                            )}
                            <div className="relative">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center font-black text-gray-400 shadow-inner border border-white group-hover:scale-110 transition-transform duration-300">
                                    {chat.name.charAt(0)}
                                </div>
                                {chat.status === 'online' && (
                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h4 className={`text-sm font-black truncate tracking-tight ${chat.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{chat.name}</h4>
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest shrink-0">{chat.time}</span>
                                </div>
                                <div className="flex flex-col gap-0.5 mb-1.5">
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 w-max px-1.5 py-0.5 rounded tracking-wide">Lead #{chat.leadId}</span>
                                    <span className="text-[10px] font-bold text-gray-500 truncate">{chat.service}</span>
                                </div>
                                <p className={`text-xs truncate leading-relaxed ${chat.unread > 0 ? 'text-blue-600 font-black' : 'text-gray-400 font-medium'}`}>{chat.lastMsg}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="h-6 w-6 rounded-xl bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-blue-100 transform group-hover:scale-110 transition-transform">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Window */}
            <div className="flex-1 overflow-hidden relative">
                {activeChat ? (
                    <ChatWindow
                        customerName={activeChat.name}
                        messages={chatMessages[activeChat.id] || []}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <div className="h-full bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                        <div className="h-24 w-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-gray-100 group">
                            <MessageSquare size={40} className="opacity-20 transform group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Select a conversation</h3>
                        <p className="text-sm font-medium max-w-xs mt-2 leading-relaxed">Choose a customer from the sidebar to continue your professional consultation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
