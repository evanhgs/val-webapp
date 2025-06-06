export interface Post {
  caption: string;
  created_at: string;
  id: string;
  image_url: string;
  user_profile_url: string;
  username: string;
  hidden_tag: boolean;
}

export interface NavPostsProps {
  post: Post[];
}