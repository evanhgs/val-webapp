import {UserDTO} from "@/types/User";
import React from "react";

export interface UploadButtonProps {
  userData: UserDTO;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}