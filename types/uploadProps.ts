import { UserProfile } from './User';

export interface UploadButtonProps {
  userData: UserProfile;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}