import Backend from "../constants/backend";

async function readConversations(userToken) {
    const response = await fetch(Backend.Chat.readConversations, {
        method: "GET",
        headers: { authorization: `Bearer ${userToken}` },
    });

    return await response.json();
}

async function readConversation(userToken, interlocutorId) {
    const response = await fetch(
        Backend.Chat.readConversation(interlocutorId),
        {
            method: "GET",
            headers: { authorization: `Bearer ${userToken}` },
        }
    );

    return await response.json();
}

async function sendMessage(userToken, receiverId, message) {
    const response = await fetch(Backend.Chat.sendMessage(receiverId), {
        method: "POST",
        headers: {
            authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });

    return await response.json();
}

async function updateMessageStatus(userToken, messageId) {
    const response = await fetch(Backend.Chat.updateMessageStatus(messageId), {
        method: "PATCH",
        headers: {
            authorization: `Bearer ${userToken}`,
        },
    });

    return await response.json();
}

async function readUnreadMessagesCount(userToken) {
    const response = await fetch(Backend.Chat.readUnreadMessagesCount, {
        headers: {
            authorization: `Bearer ${userToken}`,
        },
    });

    return await response.json();
}

const Chat = {
    readConversations,
    readConversation,
    sendMessage,
    updateMessageStatus,
    readUnreadMessagesCount,
};

export default Chat;
