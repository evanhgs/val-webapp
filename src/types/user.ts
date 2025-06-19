export interface UserProfile {
  username: string;
  email?: string;
  bio: string;
  website: string;
  created_at: string;
  profile_picture: string;
}

// interface déjà existante dans followProps, j'aurais du réfléchir au typage des le début...
export interface UserLiteProfile {
  id: string;
  username: string;
  profile_picture: string;
}