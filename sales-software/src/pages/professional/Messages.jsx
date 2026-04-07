import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import ChatWindow from '../../components/professional/ChatWindow';
import { Search, MessageSquare } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLocation } from 'react-router-dom';
import { getSocketOrigin } from '../../services/apiClient';

const Messages = () => {
    const {
        chats,
        activeChatMessages,
        fetchChatMessages,
        fetchChatThreadByJobId,
        appendIncomingChatMessage,
        sendChatMessage,
        leads,
        assignments,
        currentUser,
        refreshData,
    } = useMarketplace();
    const location = useLocation();
    const [activeChat, setActiveChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const socketRef = useRef(null);

    const assignedLeads = leads.filter((lead) => {
        const assignment = assignments.find((a) => a.leadId === lead.id && a.professionalId === currentUser?.id);
        const status = (assignment?.status || '').toLowerCase();
        return status !== 'rejected' && assignment !== undefined;
    });

    const allConversations = assignedLeads.map((lead) => {
        const assignment = assignments.find((a) => a.leadId === lead.id && a.professionalId === currentUser?.id);
        const jobId = assignment?.id;
        const dbChat = chats.find((c) => c.jobId === jobId);

        if (dbChat) {
            return {
                ...dbChat,
                isVirtual: false,
                leadNo: lead.leadNo || lead.id,
                time: dbChat.time || lead.dateRequested || new Date().toISOString(),
            };
        }
        return {
            id: `virtual-${jobId}`,
            isVirtual: true,
            jobId,
            leadNo: lead.leadNo || lead.id,
            customerName: lead.customerName,
            service: lead.serviceCategory,
            lastMessage: 'Ready for consultation',
            time: lead.dateRequested || new Date().toISOString(),
            unread: 0,
            status: 'offline',
        };
    });

    const selectChat = useCallback(
        async (chat) => {
            if (!chat) return;
            if (chat.isVirtual && chat.jobId) {
                const thread = await fetchChatThreadByJobId(chat.jobId);
                if (thread?.chatId) {
                    setActiveChat({
                        ...chat,
                        id: thread.chatId,
                        jobId: thread.jobId,
                        isVirtual: false,
                    });
                    return;
                }
                setActiveChat(chat);
                return;
            }
            setActiveChat(chat);
            if (chat.id && !String(chat.id).startsWith('virtual-')) {
                await fetchChatMessages(chat.id);
            }
        },
        [fetchChatMessages, fetchChatThreadByJobId]
    );

    useEffect(() => {
        if (location.state?.jobId && allConversations.length > 0) {
            const foundChat = allConversations.find((c) => c.jobId === location.state.jobId);
            if (foundChat) {
                selectChat(foundChat);
            }
        }
    }, [location.state?.jobId, allConversations, selectChat]);

    useEffect(() => {
        if (activeChat?.isVirtual && activeChat?.jobId) {
            const realChat = chats.find((c) => c.jobId === activeChat.jobId);
            if (realChat) {
                setActiveChat((prev) => ({ ...realChat, leadNo: prev?.leadNo }));
                fetchChatMessages(realChat.id);
            }
        }
    }, [chats, activeChat?.isVirtual, activeChat?.jobId, fetchChatMessages]);

    useEffect(() => {
        if (!activeChat?.jobId || currentUser?.role !== 'WORKER') {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        const token = localStorage.getItem('userToken');
        if (!token) return;

        const socket = io(getSocketOrigin(), {
            auth: { token },
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;

        const onConnect = () => {
            socket.emit('join_room', activeChat.jobId);
            socket.emit('join_chat', activeChat.jobId);
        };

        const onMsg = (msg) => {
            appendIncomingChatMessage({
                id: msg.id,
                text: msg.text,
                isGuest: !!msg.isGuest,
                created_at: msg.created_at,
                senderType: msg.isGuest ? 'customer' : 'professional',
            });
        };

        socket.on('connect', onConnect);
        socket.on('new_message', onMsg);
        socket.on('receive_message', onMsg);

        return () => {
            socket.off('connect', onConnect);
            socket.off('new_message', onMsg);
            socket.off('receive_message', onMsg);
            socket.disconnect();
            socketRef.current = null;
        };
    }, [activeChat?.jobId, currentUser?.role, appendIncomingChatMessage]);

    const handleSendMessage = async (text) => {
        if (!activeChat) return;
        let chatId = activeChat.id;
        if (activeChat.isVirtual && activeChat.jobId) {
            const thread = await fetchChatThreadByJobId(activeChat.jobId);
            if (thread?.chatId) {
                chatId = thread.chatId;
                setActiveChat((prev) => ({ ...prev, id: thread.chatId, isVirtual: false, jobId: thread.jobId }));
            } else {
                return;
            }
        }
        if (!chatId || String(chatId).startsWith('virtual-')) return;

        const success = await sendChatMessage(chatId, text);
        if (success) {
            refreshData();
        }
    };

    const filteredChats = allConversations
        .filter(
            (c) =>
                (c.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.service || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.time) - new Date(a.time));

    const formattedMessages = activeChatMessages.map((m) => {
        let sender = 'customer';
        if (m.senderType === 'professional') sender = 'professional';
        else if (m.senderType === 'customer') sender = 'customer';
        else sender = m.isGuest ? 'customer' : 'professional';

        const ts = m.created_at || m.createdAt || m.timestamp;
        return {
            text: m.text || m.message || '',
            sender,
            time: ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
        };
    });

    return (
        <div className="h-[calc(100dvh-64px)] md:h-[calc(100vh-140px)] flex md:gap-6 overflow-hidden animate-in fade-in duration-500 -m-4 sm:-m-6 md:m-0">
            <div
                className={`w-full md:w-80 lg:w-96 shrink-0 bg-white md:rounded-[2.5rem] shadow-sm md:border border-gray-100 flex flex-col overflow-hidden ${activeChat ? 'hidden md:flex' : 'flex'}`}
            >
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
                    {filteredChats.map((chat) => {
                        const isSelected = activeChat?.jobId && chat.jobId && activeChat.jobId === chat.jobId;
                        return (
                        <div
                            key={chat.jobId || chat.id}
                            onClick={() => selectChat(chat)}
                            className={`p-4 md:p-6 border-b border-gray-50 cursor-pointer hover:bg-blue-50/30 transition-all relative flex items-center gap-3 md:gap-4 group ${isSelected ? 'bg-blue-50/50' : ''}`}
                        >
                            {isSelected && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 md:h-12 bg-blue-600 rounded-r-full"></div>
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
                                    <h4
                                        className={`text-sm font-black truncate tracking-tight ${chat.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}
                                    >
                                        {chat.customerName}
                                    </h4>
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest shrink-0">
                                        {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5 mb-1.5">
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 w-max px-1.5 py-0.5 rounded tracking-wide">
                                        Lead #{chat.leadNo || chat.leadId}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-500 truncate">{chat.service}</span>
                                </div>
                                <p
                                    className={`text-xs truncate leading-relaxed ${chat.unread > 0 ? 'text-blue-600 font-black' : 'text-gray-400 font-medium'}`}
                                >
                                    {chat.lastMessage || 'Ready to chat'}
                                </p>
                            </div>
                        </div>
                    );
                    })}
                    {filteredChats.length === 0 && (
                        <div className="p-12 text-center text-gray-400 mt-10">
                            <MessageSquare size={48} className="mx-auto mb-3 opacity-10" />
                            <p className="text-sm font-bold uppercase tracking-widest">No active chats</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={`flex-1 overflow-hidden relative ${!activeChat ? 'hidden md:block' : 'block h-full'}`}>
                {activeChat ? (
                    <ChatWindow
                        customerName={activeChat.customerName}
                        messages={formattedMessages}
                        onSendMessage={handleSendMessage}
                        onBack={() => setActiveChat(null)}
                    />
                ) : (
                    <div className="h-full bg-white md:rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                        <div className="h-20 w-20 md:h-24 md:w-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                            <MessageSquare size={40} className="opacity-20" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Select a consultation</h3>
                        <p className="text-xs md:text-sm font-medium max-w-xs mt-2 leading-relaxed">
                            Choose a contact back from the sidebar to continue your professional consultation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
