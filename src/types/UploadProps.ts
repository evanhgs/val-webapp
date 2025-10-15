import {UserProfile} from './User.ts';

export interface UploadButtonProps {
  userData: UserProfile;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}