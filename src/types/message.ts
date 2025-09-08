import {UserLightDto} from "./user.ts";

export interface Conversation {
    id: number;
    user1: UserLightDto;
    user2: UserLightDto;
    created_at: string;
}

export interface Message {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isRead: boolean;
}

export interface ConversationContent {
    conversation: Conversation;
    messages: Message;
    detail: string;
}
