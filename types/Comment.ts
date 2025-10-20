import {UserLightDTO} from "@/types/User";

export interface CommentDTO {
    id: number;
    content: string;
    created_at: string;
    user: UserLightDTO
    postId: number;
}

// same type for fetching all comments of a post and of current user
export interface CommentsContent {
    comments: CommentDTO[];
    count: number;
}
