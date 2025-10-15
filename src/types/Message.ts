import {UserLightDto} from "./User.ts";

export interface Conversation {
    id: number;
    user1: UserLightDto;
    user2: UserLightDto;
    created_at: string;
}

export interface Message {
    id: number;
    conversationId: number;
    sender: UserLightDto;
    content: string;
    created_at: Date;
    updated_at: Date;
    isRead: boolean;
}

export interface ConversationContent {
    conversation: Conversation;
    messages: Message[];
}
