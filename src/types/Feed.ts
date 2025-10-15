import {PostDetails} from "./Post.ts";
import {FollowPropertiesData} from "./FollowProps.ts";

export interface UserFeedProps {
  userFeed: Array<PostDetails>;
  currentUsername?: string;
  followData?: FollowPropertiesData;
}
