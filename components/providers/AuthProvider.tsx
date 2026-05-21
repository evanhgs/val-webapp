"use client";

import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {AuthContextType} from "@/types/Auth";
import {UserDTO} from "@/types/User";
import {ApiEndpoints, AxiosInstance, clearStoredToken, getStoredToken, setStoredToken} from "@/lib/endpoints";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = Boolean(user);

    const logout = useCallback(() => {
        clearStoredToken();
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        const token = getStoredToken();

        if (!token) {
            setUser(null);
            return;
        }

        try {
            const { data } = await AxiosInstance.get(ApiEndpoints.user.currentUserProfile());

            setUser({
                id: data.id,
                username: data.username,
                email: data.email,
                bio: data.bio || "",
                website: data.website || "",
                gender: data.gender,
                profile_picture: data.profile_picture || "default.jpg",
                created_at: data.created_at || "",
            });
        } catch (err) {
            logout();
            throw err;
        }
    }, [logout]);

    useEffect(() => {
        refreshUser()
            .catch(() => undefined)
            .finally(() => setIsLoading(false));
    }, [refreshUser]);

    useEffect(() => {
        const handleUnauthorized = () => {
            setUser(null);
        };

        window.addEventListener("auth:unauthorized", handleUnauthorized);
        return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
    }, []);

    const login = async (token: string) => {
        setStoredToken(token);
        try {
            await refreshUser();
        } catch (err) {
            logout();
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
