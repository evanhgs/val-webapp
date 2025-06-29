import { UserProfile } from './user';

export interface UploadButtonProps {
  userData: UserProfile;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}