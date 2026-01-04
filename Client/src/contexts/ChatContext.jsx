import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    getConversationsApi,
    getConversationWithUserApi,
    getMessagesApi,
    sendMessageApi,
    createConversationApi,
    getConversationDetailApi
} from '../services/chat.service';
import signalRService from '../services/signalr.service';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user, token } = useAuth();

    // --- State ---
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isChatListOpen, setIsChatListOpen] = useState(false);
    
    // Pagination State
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [hasMore, setHasMore] = useState(true); // Track if there are more messages on server

    const MESSAGE_LIMIT = 20; // Constant for batch size

    // --- Helpers ---

    const refreshConversations = useCallback(async () => {
        if (!user) return;
        try {
            const data = await getConversationsApi();
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations", error);
        }
    }, [user]);

    const openChatWithUser = async (targetUserId) => {
        try {
            const detail = await getConversationWithUserApi(targetUserId);

            if (detail.id === "00000000-0000-0000-0000-000000000000") {
                setActiveConversation({
                    id: "virtual",
                    otherUserId: targetUserId,
                    participants: detail.participants,
                    isVirtual: true
                });
                setMessages([]);
                setHasMore(false); // No history for new chat
            } else {
                setActiveConversation({ ...detail, isVirtual: false });
                loadMessages(detail.id);
            }
            setIsChatListOpen(false);
        } catch (error) {
            console.error("Error opening chat:", error);
        }
    };

    const openChatById = async (conversationId) => {
        const conversation = await getConversationDetailApi(conversationId);
        setActiveConversation({ ...conversation, isVirtual: false });
        loadMessages(conversationId);
        setIsChatListOpen(false);
    };

    // 4. Load messages (INITIAL LOAD)
    const loadMessages = async (conversationId) => {
        setIsLoadingMessages(true);
        setHasMore(true); // Reset hasMore for new chat
        try {
            // Offset 0 for initial load
            const msgs = await getMessagesApi({ conversationId, offset: 0, limit: MESSAGE_LIMIT });
            
            // Check if we reached the end
            if (msgs.length < MESSAGE_LIMIT) {
                setHasMore(false);
            }

            // API returns Newest -> Oldest. Reverse to display Oldest -> Newest
            setMessages(msgs.reverse());
        } catch (error) {
            console.error("Error loading messages", error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    // UPDATED: Load OLDER messages (Pagination)
    const loadMoreMessages = async () => {
        if (!activeConversation || isLoadingMessages || !hasMore || activeConversation.isVirtual) return;

        setIsLoadingMessages(true);
        // Current offset is the current number of loaded messages
        const currentOffset = messages.length;

        try {
            const olderMsgs = await getMessagesApi({ 
                conversationId: activeConversation.id, 
                offset: currentOffset, 
                limit: MESSAGE_LIMIT 
            });

            if (olderMsgs.length < MESSAGE_LIMIT) {
                setHasMore(false);
            }

            if (olderMsgs.length > 0) {
                // Reverse the new batch (Newest->Oldest => Oldest->Newest)
                // Prepend them to the existing messages
                setMessages(prev => [...olderMsgs.reverse(), ...prev]);
            }
        } catch (error) {
            console.error("Error loading more messages", error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const sendMessage = async (content, files = []) => {
        if (!activeConversation) return;

        let targetConversationId = activeConversation.id;

        try {
            if (activeConversation.isVirtual) {
                const newConv = await createConversationApi({ anotherId: activeConversation.otherUserId });
                targetConversationId = newConv.id;

                setActiveConversation(prev => ({
                    ...prev,
                    id: newConv.id,
                    isVirtual: false
                }));
                refreshConversations();
            }

            await sendMessageApi({
                conversationId: targetConversationId,
                content,
                files
            });
            // Note: Message is added to state via SignalR event usually
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Failed to send message");
        }
    };

    const closeChatBox = () => {
        setActiveConversation(null);
        setMessages([]);
        setHasMore(false);
    };

    // --- SignalR Setup ---
    useEffect(() => {
        if (token && user) {
            signalRService.startConnection(token);

            const handleNewMessage = (msg) => {
                if (activeConversation && !activeConversation.isVirtual && msg.conversationId === activeConversation.id) {
                    setMessages(prev => [...prev, msg]);
                } else {
                    setUnreadCount(prev => prev + 1);
                    refreshConversations();
                }
            };

            signalRService.on("NewMessage", handleNewMessage);

            return () => {
                signalRService.off("NewMessage", handleNewMessage);
            };
        }
    }, [token, user, activeConversation, refreshConversations]);

    useEffect(() => {
        refreshConversations();
    }, [refreshConversations]);


    const value = {
        conversations,
        activeConversation,
        messages,
        unreadCount,
        isChatListOpen,
        isLoadingMessages,
        hasMore, // EXPORT THIS
        setIsChatListOpen,
        openChatWithUser,
        openChatById,
        closeChatBox,
        sendMessage,
        setUnreadCount,
        loadMoreMessages // EXPORT THIS
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};