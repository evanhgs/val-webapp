"use client";

import { useAlert } from "@/components/providers/AlertContext";

export default function AlertBanner() {
    const { alert } = useAlert();

    if (!alert) return null;

    const color =
        alert.type === "success"
            ? "bg-green-800"
            : alert.type === "error"
                ? "bg-red-600"
                : "bg-yellow-600";

    return (
        <div className={`${color} fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-50`}>
            {alert.message}
        </div>
    );
}
