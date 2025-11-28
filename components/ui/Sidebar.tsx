"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Search from "@/components/ui/Search";
import {Bell, House, Send, Settings, Telescope, Upload, User, UserSearch, Video,} from "lucide-react";
import SettingsUI from "@/components/ui/SettingsUI";

type DisplayMode = "pc" | "compact" | "phone";

interface MenuItem {
    icon: any;
    label: string;
    link?: string;
    isNavLink?: boolean;
    onClick?: () => void;
    isActive?: boolean;
}

export default function Sidebar() {
    const [isSearch, setIsSearch] = useState(false);
    const [isSetting, setIsSetting] = useState(false);
    const [displayMode, setDisplayMode] = useState<DisplayMode>("pc");
    const [isExpanded, setIsExpanded] = useState(true);

    const pathname = usePathname();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setDisplayMode("phone");
            else if (window.innerWidth < 1000) setDisplayMode("compact");
            else setDisplayMode("pc");
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menuItems: MenuItem[] = [
        { icon: <House />, label: "Home", link: "/", isNavLink: true },
        { icon: <UserSearch />, label: "Chercher", onClick: () => { setIsSetting(false); setIsSearch(true); }, isActive: isSearch },
        { icon: <Telescope />, label: "Explorer", link: "/explorer", isNavLink: true },
        { icon: <Video />, label: "Reels" },
        { icon: <Send />, label: "Messages", link: "/messages", isNavLink: true },
        { icon: <Bell />, label: "Notifications" },
        { icon: <Upload />, label: "Créer", link: "/upload", isNavLink: true },
        { icon: <User />, label: "Profil", link: "/profile", isNavLink: true },
        { icon: <Settings />, label: "Paramètres", onClick: () => { setIsSearch(false); setIsSetting(true); }, isActive: isSetting },
    ];

    // 🎨 Classes CSS pour les différents modes
    const sidebarClasses = {
        pc: `fixed left-0 top-0 h-screen ${isExpanded ? "w-[250px]" : "w-[70px]"} bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800 p-4 border-r border-white/5 overflow-y-auto z-50 shadow-[4px_0_24px_rgba(0,0,0,0.5)]`,
        compact: "fixed left-0 top-0 h-screen w-[70px] bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800 p-4 border-r border-white/5 overflow-y-auto z-50 shadow-[4px_0_24px_rgba(0,0,0,0.5)]",
        phone: "fixed bottom-0 left-0 w-full h-16 bg-gradient-to-t from-zinc-900 via-zinc-900 to-zinc-800 px-2 py-2 border-t border-white/5 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] backdrop-blur-lg",
    };

    const menuItemStyles = {
        pc: {
            container: "space-y-2",
            item: `flex items-center ${isExpanded ? "space-x-3 px-4" : "justify-center px-2"} py-3 rounded-xl transition-all duration-200 font-medium text-sm`,
            showLabel: isExpanded,
        },
        compact: {
            container: "space-y-2",
            item: "flex items-center justify-center p-3 rounded-xl transition-all duration-200",
            showLabel: false,
        },
        phone: {
            container: "flex justify-around items-center h-full",
            item: "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px]",
            showLabel: false,
        },
    };

    // 📌 Toggle sidebar
    const toggleSidebar = () => {
        if (displayMode === "pc") setIsExpanded(!isExpanded);
    };

    // 🧭 Rendu d'un item du menu
    const renderMenuItem = (item: MenuItem, index: number) => {
        const currentStyle = menuItemStyles[displayMode];
        const isActive = item.isNavLink && item.link ? pathname.startsWith(item.link) : item.isActive;

        const activeClasses = "bg-white text-zinc-900 shadow-[0_4px_16px_rgba(255,255,255,0.25)] scale-105";
        const hoverClasses = "hover:bg-zinc-800 hover:scale-105 text-zinc-300 hover:text-white hover:shadow-[0_4px_16px_rgba(255,255,255,0.1)]";

        const content = (
            <>
                <span
                    role="img"
                    aria-label={item.label.toLowerCase()}
                    className={`text-xl ${displayMode === "phone" ? "text-lg" : ""} transition-transform duration-200`}
                >
                    {item.icon}
                </span>
                {currentStyle.showLabel && (
                    <span className="truncate">{item.label}</span>
                )}
            </>
        );

        if (item.isNavLink && item.link) {
            return (
                <li key={index}>
                    <Link
                        href={item.link}
                        className={`${currentStyle.item} ${isActive ? activeClasses : hoverClasses}`}
                    >
                        {content}
                    </Link>
                </li>
            );
        }

        return (
            <li key={index}>
                <div
                    onClick={item.onClick}
                    className={`${currentStyle.item} cursor-pointer ${item.isActive ? activeClasses : hoverClasses}`}
                >
                    {content}
                </div>
            </li>
        );
    };

    // 📌 Position de la Search/Settings box selon le mode
    const floatingBoxPosition =
        displayMode === "phone"
            ? "left-4 bottom-20"
            : displayMode === "compact"
                ? "left-[80px] top-4"
                : `${isExpanded ? "left-[260px]" : "left-[80px]"} top-4`;

    return (
        <>
            {/* 🧭 Sidebar */}
            <div className={`transition-all duration-300 ${sidebarClasses[displayMode]}`}>
                {displayMode !== "phone" && (
                    <div className="flex justify-end mb-6">
                        <button
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                            onClick={toggleSidebar}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-300 ${isExpanded ? "" : "rotate-180"}`}
                            >
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                    </div>
                )}

                <ul className={menuItemStyles[displayMode].container}>
                    {menuItems.map(renderMenuItem)}
                </ul>
            </div>

            {/* ⚙️ Search / Settings */}
            <div className={`fixed transition-all duration-300 ${floatingBoxPosition} flex flex-col space-y-4 z-40`}>
                {isSearch && <Search setIsSearch={setIsSearch} setIsSetting={setIsSetting} isCompact={false} />}
                {isSetting && <SettingsUI setIsSetting={setIsSetting} setIsSearch={setIsSearch} isCompact={false} />}
            </div>

            {displayMode === "phone" && <div className="pb-16"></div>}
        </>
    );
}