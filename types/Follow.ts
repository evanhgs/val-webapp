export interface FollowUser {
    id: number;
    username: string;
    profile_picture?: string;
    followed_at?: string;
}

export interface FollowPropertiesData {
    followers: {
        count: number;
        followers: FollowUser[]
    };
    followed: {
        count: number;
        followed: FollowUser[]
    }
    isFollowed: boolean;
}

export type Follower = {
    username: string;
}
