import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useChat } from '../../../contexts/chatContext';
import { useAuth } from '../../../contexts/AuthContext';

export const ChatBox = () => {
    // UPDATED: Destructure loadMoreMessages and hasMore
    const { activeConversation, messages, closeChatBox, sendMessage, loadMoreMessages, hasMore, isLoadingMessages } = useChat();
    const { user } = useAuth();

    const [inputText, setInputText] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [viewingAttachment, setViewingAttachment] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    // UPDATED: Add ref for the scrollable container
    const scrollContainerRef = useRef(null);
    // UPDATED: Ref to store scroll height before loading more
    const previousScrollHeightRef = useRef(0);

    // --- SCROLL HANDLING ---

    // 1. Detect scroll to top
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight } = e.target;
        
        // If at top, has more data, and not currently loading
        if (scrollTop === 0 && hasMore && !isLoadingMessages) {
            // Capture current height so we can adjust position after render
            previousScrollHeightRef.current = scrollHeight;
            loadMoreMessages();
        }
    };

    // 2. Adjust scroll position after messages update
    useLayoutEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Case A: Initial Load or New Message sent by user/signalR (at bottom)
        // We check if the change was due to pagination by checking if we saved a previous height
        if (previousScrollHeightRef.current > 0 && messages.length > 0) {
            // Calculate how much height was added
            const newScrollHeight = container.scrollHeight;
            const heightDifference = newScrollHeight - previousScrollHeightRef.current;
            
            // Push scroll down by that difference to keep view stable
            container.scrollTop = heightDifference;
            
            // Reset ref
            previousScrollHeightRef.current = 0;
        } else {
            // Case B: Regular new message (Auto scroll to bottom)
            // Only scroll to bottom if we are already near the bottom OR it's the very first load
            // Simple approach: Always scroll to bottom on new messages if not paginating
             messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    if (!user || !activeConversation) return null;

    const otherParticipant = activeConversation.participants?.find(
        (p) => p.userId !== user.userId
    );

    const chatTitle = otherParticipant?.fullName || "Chat";
    const chatAvatar = otherParticipant?.avatarUrl;

    const handleFileSelect = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (indexToRemove) => {
        setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() && selectedFiles.length === 0) return;

        const text = inputText;
        const filesToSend = selectedFiles;

        setInputText("");
        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        // Reset scroll ref to ensure we scroll to bottom for new message
        previousScrollHeightRef.current = 0; 
        
        await sendMessage(text, filesToSend);
    };

    const renderAttachment = (att) => {
        const isImage = att.fileType === 1 || att.mimeType?.startsWith('image/');
        const isVideo = att.fileType === 2 || att.mimeType?.startsWith('video/');

        if (isImage) {
            return (
                <div key={att.id} className="mt-1">
                    <img
                        src={att.fileUrl}
                        alt={att.fileName}
                        className="rounded-lg max-h-48 w-auto object-cover cursor-pointer hover:opacity-95 transition"
                        onClick={() => setViewingAttachment({ type: 'image', url: att.fileUrl })} 
                    />
                </div>
            );
        }

        if (isVideo) {
            return (
                <div 
                    key={att.id} 
                    className="mt-1 max-w-[200px] relative cursor-pointer group"
                    onClick={() => setViewingAttachment({ type: 'video', url: att.fileUrl })}
                >
                    <video
                        src={att.fileUrl}
                        className="rounded-lg w-full max-h-48 bg-black object-cover"
                        preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition rounded-lg">
                        <div className="bg-white/80 rounded-full p-2 backdrop-blur-sm shadow-sm">
                            <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <a
                key={att.id}
                href={att.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 mt-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group w-60 border border-gray-100"
            >
                <div className="bg-white p-1.5 rounded-full text-blue-500 shadow-sm border border-gray-100 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" /></svg>
                </div>
                
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate" title={att.fileName}>
                        {att.fileName}
                    </p>
                    <p className="text-[10px] text-gray-400">{(att.fileSize / 1024).toFixed(1)} KB</p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
            </a>
        );
    };

    return (
        <>
            <div className="fixed bottom-0 right-10 w-80 h-[26rem] bg-white shadow-2xl rounded-t-lg flex flex-col border border-gray-300 z-50 animate-in slide-in-from-bottom-5">
                {/* HEADER */}
                <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center shadow-md">
                    <div className="font-semibold flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full bg-blue-400 overflow-hidden border border-blue-300 flex items-center justify-center">
                            {chatAvatar ? (
                                <img src={chatAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs font-bold uppercase">{chatTitle.charAt(0)}</span>
                            )}
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-blue-600 rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm leading-tight">{chatTitle}</span>
                            <span className="text-[10px] text-blue-200">Đang hoạt động</span>
                        </div>
                    </div>
                    <button onClick={closeChatBox} className="text-blue-100 hover:text-white hover:bg-blue-700 rounded-full p-1 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* MESSAGES AREA */}
                {/* UPDATED: Added ref, onScroll, and removed useEffect auto-scroll logic from top level */}
                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50"
                >
                    {/* Loading Indicator for Pagination */}
                    {isLoadingMessages && hasMore && messages.length > 0 && (
                        <div className="flex justify-center py-2">
                             <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}

                    {messages.length === 0 && !isLoadingMessages && (
                        <div className="text-center text-gray-400 text-sm mt-10">
                            <p>👋 Say hello to {chatTitle}!</p>
                        </div>
                    )}

                    {messages.map((msg, index) => {
                        const isMe = msg.senderId === user.userId;
                        return (
                            <div key={msg.id || index} className={`flex flex-col mb-2 ${isMe ? 'items-end' : 'items-start'}`}>
                                {msg.content && (
                                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm break-words shadow-sm mb-1 ${
                                        isMe ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                    }`}>
                                        <p>{msg.content}</p>
                                    </div>
                                )}
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        {msg.attachments.map(att => renderAttachment(att))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* FILE PREVIEW AREA */}
                {selectedFiles.length > 0 && (
                    <div className="px-3 py-2 bg-gray-100 border-t border-gray-200 flex gap-2 overflow-x-auto">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="relative group min-w-[60px] w-[60px] h-[60px] rounded-lg border border-gray-300 bg-white flex items-center justify-center overflow-hidden">
                                {file.type.startsWith("image/") ? (
                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-1">
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" /></svg>
                                        <span className="text-[8px] text-gray-600 truncate w-full text-center">{file.name.split('.').pop()}</span>
                                    </div>
                                )}
                                <button type="button" onClick={() => removeFile(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* INPUT AREA */}
                <form onSubmit={handleSend} className="p-3 border-t bg-white flex items-center gap-2">
                    <button type="button" onClick={triggerFileSelect} className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors" title="Attach file">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" />
                    <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    <button type="submit" disabled={!inputText.trim() && selectedFiles.length === 0} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </form>
            </div>

            {/* --- MEDIA MODAL (IMAGE & VIDEO) --- */}
            {viewingAttachment && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setViewingAttachment(null)} 
                >
                    <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                setViewingAttachment(null);
                            }}
                            className="absolute cursor-pointer -top-12 right-0 text-white hover:text-gray-300 p-2 transition-colors z-50"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        {viewingAttachment.type === 'image' ? (
                            <img 
                                src={viewingAttachment.url} 
                                alt="Full size" 
                                className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
                                onClick={(e) => e.stopPropagation()} 
                            />
                        ) : (
                            <video 
                                src={viewingAttachment.url} 
                                controls
                                autoPlay
                                className="max-w-full max-h-[85vh] rounded-md shadow-2xl bg-black"
                                onClick={(e) => e.stopPropagation()} 
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};