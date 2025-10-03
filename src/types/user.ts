export interface UserProfile {
  id: string;
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
  profile_picture?: string | null;
}

export interface UserLightDto {
    id: number;
    username: string;
    profile_picture: string;
}

export interface UserEditProfile {
  username: string;
  email: string;
  bio: string;
  website: string;
  gender: string;
}
