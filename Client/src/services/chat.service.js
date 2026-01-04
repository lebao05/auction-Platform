import axios from "../configs/axios";


export async function createConversationApi({ anotherId }) {
    // Corresponds to [HttpPost] CreateConversation
    const response = await axios.post("/conversation", { anotherId });
    return response.data;
}

export async function getConversationsApi() {
    // Corresponds to [HttpGet] GetConversations
    const response = await axios.get("/conversation");
    return response.data;
}

export async function getConversationDetailApi(conversationId) {
    // Corresponds to [HttpGet("{conversationId:guid}")]
    const response = await axios.get(`/conversation/${conversationId}`);
    return response.data;
}

export async function getMessagesApi({ conversationId, offset = 0, limit = 20 }) {
    // Corresponds to [HttpGet("{conversationId:guid}/messages")]
    // Params are passed via the 'params' object to be serialized as query strings
    const response = await axios.get(`/conversation/${conversationId}/messages`, {
        params: {
            offset,
            limit
        }
    });
    return response.data;
}

export async function sendMessageApi({ conversationId, content, files }) {
    // Corresponds to [HttpPost("{conversationId:guid}/messages")]
    // Because the C# controller uses [FromForm] and supports files, we must use FormData
    const formData = new FormData();
    
    // We append the ConversationId to the body as well, matching the DTO
    formData.append('ConversationId', conversationId);
    
    if (content) {
        formData.append('Content', content);
    }

    if (files && files.length > 0) {
        // Assuming 'files' is an array of native File objects or Blobs
        files.forEach((file) => {
            formData.append('Files', file);
        });
    }

    const response = await axios.post(`/conversation/${conversationId}/messages`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export async function getConversationWithUserApi(otherUserId) {
    // Corresponds to [HttpGet("with/{otherUserId:guid}")]
    const response = await axios.get(`/conversation/with/${otherUserId}`);
    return response.data;
}