"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContextType} from "@/types/Auth";
import {UserLoginDTO} from "@/types/User";
import {ApiEndpoints} from "@/lib/endpoints";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserLoginDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");
        const storedProfilePicture = localStorage.getItem("profilePicture");
        const storedId = localStorage.getItem("id");
        const storedCreatedAt = localStorage.getItem("createdAt");


        if (storedToken && storedUsername && storedProfilePicture && storedId) {
            const idNumber = Number(storedId);
            setUser({
                id: idNumber,
                username: storedUsername,
                profile_picture: storedProfilePicture,
                created_at: storedCreatedAt ?? new Date().toISOString(),
                token: storedToken,
            });

            validateToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const validateToken = async (token: string) => {
        try {
            const { data } = await axios.post(ApiEndpoints.auth.authToken(), { token });
            if (!data.valid) logout();
        } catch (err) {
            console.error("Token validation failed", err);
            logout();
        }
    };

    const login = (token: string, id: number, profilePicture: string, username: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("profilePicture", profilePicture);
        localStorage.setItem("id", String(id));
        localStorage.setItem("createdAt", new Date().toISOString());

        setUser({
            id,
            username,
            profile_picture: profilePicture,
            created_at: new Date().toISOString(),
            token: token,
        });

        document.cookie = `token=${token}; path=/;`; // cookie for middleware
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        document.cookie = `token=; path=/; max-age=0`; // supprime le cookie
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
