import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import {AuthProvider} from "@/components/providers/AuthProvider";
import {AlertProvider} from "@/components/providers/AlertContext";
import AlertBanner from "@/components/ui/AlertBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valenstagram",
  description: "New social media of Iut de Valence",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}> ) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
            <AlertProvider>
                <AlertBanner />
                {children}
            </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
