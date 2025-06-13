import { Post } from "../types/post";
import { FollowPropertiesData } from "./followProps";

export interface UserFeedProps {
  userFeed: Array<Post>;
  currentUsername?: string;
  followData?: FollowPropertiesData;
}
