import React from "react";
import Sidebar from "@/components/ui/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Sidebar />
        {children}
    </>
  );
}