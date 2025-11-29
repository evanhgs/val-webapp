import {UserLoginDTO} from "@/types/User";

export interface AuthContextType {
    user: UserLoginDTO | null;
    login: (token: string, id: number, profilePicture: string, username: string) => void;
    logout: () => void;
    isLoading?: boolean;
}