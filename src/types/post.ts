export interface Post {
  caption?: string;
  created_at: string;
  id: string;
  image_url: string;
  user_profile?: string;
  username: string;
  hidden_tag: boolean;
  user_id?: string;
}

export interface NavPostsProps {
  post: Post[];
}
