import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="auth-layout bg-gray-950">
            {children}
        </div>
    );
}
