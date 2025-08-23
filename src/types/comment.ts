export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    userId: number;
    postId: number;
}

// same type for fetching all comments of a post and of current user
export interface CommentsContent {
    comments: Comment[];
    count: number;
}
