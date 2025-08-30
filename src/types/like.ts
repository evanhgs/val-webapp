import {PostLight} from "./post.ts";
import {UserLiteProfile} from "./user.ts";

// work for like & unlike post
export interface Like {
    id: number;
    postId: number;
    userId: number;
    createdAt: string;
}

export interface LikedPostsByUser {
    userId: number;
    liked_posts: PostLight[];
    count: number;
}

export interface LikesFromPost {
    postId: number;
    likes_count: number;
    users: UserLiteProfile[];
}
