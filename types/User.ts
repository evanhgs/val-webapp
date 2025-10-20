export interface UserDTO {
  id: number;
  username: string;
  email?: string;
  bio?: string;
  website?: string;
  gender?: string;
  profile_picture: string;
  created_at: string;
}

export interface UserLoginDTO extends UserDTO {
    token: string
}

export interface UserLightDTO {
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
