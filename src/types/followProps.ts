export interface FollowUser {
    id: string;
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
