"use client";

import {useAlert} from "@/components/providers/AlertContext";

export default function AlertBanner() {
    const { alert } = useAlert();

    if (!alert) return null;

    const styles =
        alert.type === "success"
            ? "bg-gradient-to-br from-emerald-900/90 to-emerald-800/90 border-emerald-500/20 shadow-[0_8px_32px_rgba(16,185,129,0.15)]"
            : alert.type === "error"
                ? "bg-gradient-to-br from-red-900/90 to-red-800/90 border-red-500/20 shadow-[0_8px_32px_rgba(239,68,68,0.15)]"
                : "bg-gradient-to-br from-amber-900/90 to-amber-800/90 border-amber-500/20 shadow-[0_8px_32px_rgba(245,158,11,0.15)]";

    const icon =
        alert.type === "success"
            ? (
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )
            : alert.type === "error"
                ? (
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )
                : (
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );

    return (
        <div
            className={`${styles} fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3.5 rounded-xl text-white border backdrop-blur-md z-50 animate-in slide-in-from-top-2 duration-300 flex items-center gap-3 min-w-[320px] max-w-[500px]`}
        >
            <div className="flex-shrink-0">
                {icon}
            </div>
            <p className="text-sm font-medium flex-1">
                {alert.message}
            </p>
        </div>
    );
}