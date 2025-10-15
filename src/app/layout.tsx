'use client';

import {Sidebar} from "../components/UIX/Sidebar";
import React, {useEffect, useState} from "react";
import AlertPopup from "../components/UIX/AlertPopup";
import {Header} from "../components/UIX/Header";
import {AlertProvider} from "../components/Context/AlertContext";
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {

    const [isMobile, setIsMobile] = useState(false);

    // Détecte si l'appareil est mobile pour l'affichage adaptatif
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <html lang="fr">
        <body>
        <AlertProvider>
            <AlertPopup />
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <main style={{ flexGrow: 1 }}>
                    <div className={`fixed top-0 right-0 z-20 ${isMobile ? 'left-0' : 'left-[72px] lg:left-[244px]'}`}>
                        <Header />
                    </div>
                    <div className={`pt-16 md:pt-20 z-10 relative ${isMobile ? '' : 'md:ml-[72px] lg:ml-[244px]'}`}>
                        {children}
                    </div>
                </main>
            </div>
        </AlertProvider>
        </body>
        </html>
    );
}