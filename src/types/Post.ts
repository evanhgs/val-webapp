export interface Post {
  caption?: string;
  created_at: string;
  id: number;
  image_url: string;
  user_profile?: string;
  username: string;
  hidden_tag: boolean;
  user_id?: number;
}

export interface PostDetails {
  caption?: string;
  created_at: string;
  id: number;
  image_url: string;
  user_profile?: string;
  username: string;
  hidden_tag: boolean;
  user_id?: number;
  likes: {count: number};
  comments: {count: number};
}

export interface NavPostsProps {
  post: PostDetails[];
}

export interface PostLight {
    id: number;
    imageUrl: string;
    caption: string;
    userId: number;
    username: string;
    userProfile?: string;
    createdAt: string;
}
