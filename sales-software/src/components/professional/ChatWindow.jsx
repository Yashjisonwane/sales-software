import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Paperclip, Smile, MoreHorizontal, Check, MessageSquare, Image as ImageIcon, X } from 'lucide-react';

const ChatWindow = ({ customerName, messages = [], onSendMessage }) => {
    const [text, setText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if ((text.trim() || selectedImage) && onSendMessage) {
            // In a real app, photos would be uploaded first or sent as multipart
            // For now, we'll send the text. If an image is selected, we mock it.
            const messageText = text.trim() || (selectedImage ? "Attachment: Image" : "");
            onSendMessage(messageText);
            setText('');
            setSelectedImage(null);
            setShowEmojiPicker(false);
        }
    };

    const addEmoji = (emoji) => {
        setText(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const commonEmojis = ['😊', '🤝', '✅', '🏗️', '📍', '💰', '📅', '👷', '🏠', '✨'];

    return (
        <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl shadow-inner border border-white">
                        {customerName ? customerName.charAt(0) : 'C'}
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 tracking-tight text-base md:text-lg leading-tight">{customerName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-200"></div>
                            <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-black">Active Now</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 md:p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                        <User size={18} className="md:w-5 md:h-5" />
                    </button>
                    <button className="p-2 md:p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all">
                        <MoreHorizontal size={18} className="md:w-5 md:h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gray-50/20 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === 'professional' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                        <div className={`max-w-[85%] md:max-w-[75%] rounded-[1.5rem] md:rounded-[2rem] px-5 py-3 md:px-6 md:py-4 shadow-sm relative group ${msg.sender === 'professional'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                            }`}>
                            {msg.text.startsWith('Attachment: Image') ? (
                                <div className="space-y-2">
                                    <div className="rounded-xl overflow-hidden bg-gray-100 min-w-[200px]">
                                        <div className="aspect-video flex items-center justify-center text-gray-400">
                                            <ImageIcon size={24} />
                                        </div>
                                    </div>
                                    <p className="text-[10px] italic opacity-70">Shared a photo</p>
                                </div>
                            ) : (
                                <p className="text-xs md:text-sm font-bold leading-relaxed">{msg.text}</p>
                            )}
                            <div className="flex items-center justify-between gap-4 mt-2">
                                <p className={`text-[10px] font-black uppercase tracking-tighter opacity-60 ${msg.sender === 'professional' ? 'text-white' : 'text-gray-400'}`}>
                                    {msg.time || 'now'}
                                </p>
                                {msg.sender === 'professional' && (
                                    <Check size={12} className="opacity-40" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                            <MessageSquare size={32} className="opacity-20" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Start the conversation</h4>
                        <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-tight">Messaging available for this assignment</p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-white border-t border-gray-50 shrink-0">
                {selectedImage && (
                    <div className="mb-4 flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100 animate-in slide-in-from-bottom-2">
                        <div className="h-16 w-16 bg-white rounded-xl overflow-hidden border border-blue-200">
                            <img src={selectedImage} alt="Selected" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Photo selected</p>
                            <p className="text-[10px] text-blue-400 font-bold">Will be sent with message</p>
                        </div>
                        <button onClick={() => setSelectedImage(null)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl">
                            <X size={20} />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSend} className="flex items-center gap-2 md:gap-4 bg-gray-50 p-2 md:p-3 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 focus-within:border-blue-200 transition-all focus-within:shadow-lg focus-within:shadow-blue-50/50">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors shrink-0"
                    >
                        <Paperclip size={20} />
                    </button>
                    
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-900 placeholder-gray-400 py-1"
                        placeholder="Write a message..."
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            if (e.target.value.length === 0) setShowEmojiPicker(false);
                        }}
                    />

                    <div className="relative">
                        <button 
                            type="button" 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`p-2 transition-colors shrink-0 ${showEmojiPicker ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`}
                        >
                            <Smile size={20} />
                        </button>
                        
                        {showEmojiPicker && (
                            <div className="absolute bottom-14 right-0 bg-white p-3 rounded-2xl shadow-2xl border border-gray-100 flex gap-2 animate-in fade-in slide-in-from-bottom-2 z-50">
                                {commonEmojis.map(emoji => (
                                    <button 
                                        key={emoji} 
                                        type="button" 
                                        onClick={() => addEmoji(emoji)}
                                        className="text-xl hover:scale-125 transition-transform p-1"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!text.trim() && !selectedImage}
                        className="h-10 w-10 md:h-12 md:w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-2xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center shrink-0"
                    >
                        <Send size={18} md:size={20} fill="currentColor" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
