"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LogoutPage() {
    const router = useRouter();
    const { logout } = useAuth();

    useEffect(() => {
        logout();
        router.replace("/login");
    }, [logout, router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-gray-600">Déconnexion en cours...</p>
        </div>
    );
}
