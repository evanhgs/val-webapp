import {UserDTO} from "@/types/User";

export interface AuthContextType {
    user: UserDTO | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}
