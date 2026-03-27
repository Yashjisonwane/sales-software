import React, { useState } from 'react';
import { Send, User, Paperclip, Smile, MoreHorizontal, Check, MessageSquare } from 'lucide-react';

const ChatWindow = ({ customerName, messages = [], onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (text.trim() && onSendMessage) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl shadow-inner border border-white">
                        {customerName ? customerName.charAt(0) : 'C'}
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 tracking-tight text-lg leading-tight">{customerName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-200"></div>
                            <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-black">Active Now</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                        <User size={20} />
                    </button>
                    <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === 'professional' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[80%] rounded-3xl px-6 py-4 shadow-sm relative group ${msg.sender === 'professional'
                            ? 'bg-blue-600 text-white rounded-br-none shadow-blue-100'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                            }`}>
                            <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                            <p className={`text-[10px] mt-2 font-black uppercase tracking-tighter opacity-60 ${msg.sender === 'professional' ? 'text-right' : 'text-left'}`}>
                                {msg.time || '10:00 AM'}
                            </p>
                            {msg.sender === 'professional' && (
                                <Check size={12} className="absolute bottom-4 right-2 opacity-40" />
                            )}
                        </div>
                    </div>
                ))}
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                            <MessageSquare size={32} className="opacity-20" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest">Start the conversation</p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-50 shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-4 bg-gray-50/50 p-2 rounded-3xl border border-gray-100 focus-within:border-blue-200 transition-all focus-within:shadow-lg focus-within:shadow-blue-50">
                    <button type="button" className="p-3 text-gray-400 hover:text-blue-600 transition-colors shrink-0">
                        <Paperclip size={20} />
                    </button>
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-900 placeholder-gray-400 py-2"
                        placeholder="Write a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button type="button" className="p-3 text-gray-300 hover:text-amber-500 transition-colors shrink-0">
                        <Smile size={20} />
                    </button>
                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center shrink-0"
                    >
                        <Send size={20} fill="currentColor" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
