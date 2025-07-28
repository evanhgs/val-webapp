import {PostDetails} from "./post.ts";
import { FollowPropertiesData } from "./followProps";

export interface UserFeedProps {
  userFeed: Array<PostDetails>;
  currentUsername?: string;
  followData?: FollowPropertiesData;
}
