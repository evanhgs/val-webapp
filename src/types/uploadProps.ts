import { UserType } from '../types/auth';

export interface UploadButtonProps {
  userData: UserType;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}