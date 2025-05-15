export interface FollowUser {
    id: string;
    username: string;
    profile_picture?: string;
}

export interface FollowButtonProps {
    user: FollowUser;
}