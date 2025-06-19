import { UserLiteProfile } from "./user";
export interface Like {
    id: string;
    userId: string;
    postId: string;
    createdAt: string;
}

export interface LikeContent {
    postId: string;
    users: UserLiteProfile[];
    likeCount: number;
}