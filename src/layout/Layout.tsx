import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";

const Layout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Détecte si l'appareil est mobile pour l'affichage adaptatif
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex bg-black min-h-screen text-white relative">
      {/* place la sidebar en avant (évite la superposition zbi) */}
      <div className="relative z-30">
        <Sidebar />
      </div>
      
      {/* main container */}
      <div className="flex flex-col min-h-screen text-white flex-grow">
        <div className={`fixed top-0 right-0 z-20 ${isMobile ? 'left-0' : 'left-[72px] lg:left-[244px]'}`}>
          <Header />
        </div>
        <main className={`pt-16 md:pt-20 z-10 relative ${isMobile ? '' : 'md:ml-[72px] lg:ml-[244px]'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;