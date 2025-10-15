import {UserLightDto} from "./User.ts";

export interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: UserLightDto
    postId: number;
}

// same type for fetching all comments of a post and of current user
export interface CommentsContent {
    comments: Comment[];
    count: number;
}
