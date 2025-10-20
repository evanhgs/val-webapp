// work for like & unlike post
import {PostLight} from "@/types/Post";
import {UserLightDTO} from "@/types/User";

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
    users: UserLightDTO[];
}
