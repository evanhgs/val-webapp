import {PostDetails} from "@/types/Post";
import {FollowPropertiesData} from "@/types/Follow";

export interface UserFeedProps {
  userFeed: Array<PostDetails>;
  currentUsername?: string;
  followData?: FollowPropertiesData;
}
