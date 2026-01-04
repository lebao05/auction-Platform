import { useChat } from './ChatContext';

const ConversationList = () => {
    const { conversations, isChatListOpen, openChatById } = useChat();

    if (!isChatListOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg overflow-hidden z-50 border border-gray-200">
            <div className="p-3 border-b bg-gray-50 font-bold text-gray-700">Chats</div>
            <div className="max-h-96 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No conversations yet.</div>
                ) : (
                    conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => openChatById(conv.id)}
                            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center border-b last:border-0"
                        >
                            {/* Avatar Placeholder */}
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                {conv.lastMessagePreview?.senderName?.[0] || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                {/* Ideally filter participants to show the OTHER person's name */}
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    Conversation
                                </p>
                                <p className={`text-xs truncate ${!conv.lastMessagePreview ? 'text-gray-400 italic' : 'text-gray-500'}`}>
                                    {conv.lastMessagePreview?.content || "No messages"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};