export interface FollowUser {
    id: string;
    username: string;
    profile_picture?: string;
}

export interface FollowButtonProps {
    user: FollowUser;
    isFollowed: boolean;
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