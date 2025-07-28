import {UserLiteProfile} from "./user.ts";

export interface StoriesProps {
  username?: string | null;
  profile_picture?: string | null;
}

export interface UserStories {
  count_user: number | null;
  followed_users?: Array<UserLiteProfile>;
}
