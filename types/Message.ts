import {UserLightDTO} from "@/types/User";

export interface Conversation {
    id: number;
    user1: UserLightDTO;
    user2: UserLightDTO;
    created_at: string;
}

export interface MessageDTO {
    id: number;
    conversationId: number;
    sender: UserLightDTO;
    content: string;
    created_at: Date;
    updated_at: Date;
    isRead: boolean;
}

export interface ConversationContent {
    conversation: Conversation;
    messages: MessageDTO[];
}
