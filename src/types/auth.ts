export interface UserType  {
  username: string;
  email?: string;
  bio?: string;
  website?: string;
  created_at?: string;
  token: string;
  profilePicture: string;
  id: string;
}

export interface AuthContextType {
  user: UserType | null;                            
  login: (token: string, username: string, profilePicture: string, id: string) => void;
  logout: ()=> void;
}