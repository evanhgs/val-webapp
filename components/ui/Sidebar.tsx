"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Search from "@/components/ui/Search";
import Settings from "@/components/ui/Settings";

type DisplayMode = "pc" | "compact" | "phone";

interface MenuItem {
    icon: string;
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

    // 📐 Détection dynamique de la taille de l'écran
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

    // 📋 Liste des éléments du menu
    const menuItems: MenuItem[] = [
        { icon: "🏠", label: "Home", link: "/", isNavLink: true },
        { icon: "🔍", label: "Chercher", onClick: () => { setIsSetting(false); setIsSearch(true); }, isActive: isSearch },
        { icon: "🧭", label: "Explorer", link: "/explorer", isNavLink: true },
        { icon: "▶️", label: "Reels" },
        { icon: "📩", label: "Messages", link: "/messages", isNavLink: true },
        { icon: "❤️", label: "Notifications" },
        { icon: "➕", label: "Créer", link: "/upload", isNavLink: true },
        { icon: "👤", label: "Profil", link: "/profile", isNavLink: true },
        { icon: "⚙️", label: "Paramètres", onClick: () => { setIsSearch(false); setIsSetting(true); }, isActive: isSetting },
    ];

    // 🎨 Classes CSS pour les différents modes
    const sidebarClasses = {
        pc: `fixed left-0 top-0 h-screen ${isExpanded ? "w-[250px]" : "w-[70px]"} bg-zinc-900 p-4 border-r border-gray-800 overflow-y-auto z-50`,
        compact: "fixed left-0 top-0 h-screen w-[70px] bg-zinc-900 p-4 border-r border-gray-800 overflow-y-auto z-50",
        phone: "fixed bottom-0 left-0 w-full h-16 bg-zinc-900 px-2 py-1 border-t border-gray-800 z-50",
    };

    const menuItemStyles = {
        pc: {
            container: "space-y-4",
            item: `flex items-center ${isExpanded ? "space-x-3" : "justify-center"} p-2 rounded-lg`,
            showLabel: isExpanded,
        },
        compact: {
            container: "space-y-4",
            item: "flex items-center justify-center p-2 rounded-lg",
            showLabel: false,
        },
        phone: {
            container: "flex justify-around",
            item: "flex flex-col items-center justify-center p-1 rounded-lg",
            showLabel: false,
        },
    };

    // 📌 Toggle sidebar
    const toggleSidebar = () => {
        if (displayMode === "pc") setIsExpanded(!isExpanded);
    };

    // 🧭 Rendu d’un item du menu
    const renderMenuItem = (item: MenuItem, index: number) => {
        const currentStyle = menuItemStyles[displayMode];
        const isActive = item.isNavLink && item.link ? pathname.startsWith(item.link) : item.isActive;

        const activeClasses = "border border-white cursor-pointer";
        const hoverClasses = "hover:border hover:border-white cursor-pointer";

        const content = (
            <>
        <span
            role="img"
            aria-label={item.label.toLowerCase()}
            className={`text-xl ${displayMode === "phone" ? "text-lg" : ""}`}
        >
          {item.icon}
        </span>
                {currentStyle.showLabel && <span>{item.label}</span>}
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
                    className={`${currentStyle.item} ${item.isActive ? activeClasses : hoverClasses}`}
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
                    <div className="flex justify-end mb-4">
                        <button
                            className="text-gray-400 hover:text-white focus:outline-none"
                            onClick={toggleSidebar}
                        >
                            {isExpanded ? "←" : "→"}
                        </button>
                    </div>
                )}

                <ul className={menuItemStyles[displayMode].container}>
                    {menuItems.map(renderMenuItem)}
                </ul>
            </div>

            {/* ⚙️ Search / Settings */}
            <div className={`fixed transition-all duration-300 ${floatingBoxPosition} flex flex-col space-y-4`}>
                {isSearch && <Search setIsSearch={setIsSearch} setIsSetting={setIsSetting} isCompact={false} />}
                {isSetting && <Settings setIsSetting={setIsSetting} setIsSearch={setIsSearch} isCompact={false} />}
            </div>

            {displayMode === "phone" && <div className="pb-16"></div>}
        </>
    );
}
