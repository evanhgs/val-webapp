export interface FollowUser {
    id: string;
    username: string;
    profile_picture?: string;
}

export interface FollowButtonProps {
    user: FollowUser;
}

export interface FollowProperties {
    count: number;
    users: FollowUser[];
}

export interface FollowPropertiesData {
    followers: FollowProperties | undefined;
    followed: FollowProperties | undefined;
    isFollowed: boolean;
}