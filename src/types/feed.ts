import { Post } from "../types/post";

export interface UserFeedProps {
  userFeed: Array<Post>; 
  currentUsername?: string; 
}
