import React, {useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import Search  from './Search';
import Settings from './Settings';


export const Sidebar: React.FC = () => {


  const [isSearch, setIsSearch] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isSetting, setIsSetting] = useState(false);

  // check taille de l'écran et ajuste sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 1000);
    };
    handleResize();
    window.addEventListener('resize', handleResize); // écoute h24 le redimensionnement

    return () => window.removeEventListener('resize', handleResize); // nettoie le listener
  }, []);



  return (
    <>
      <div 
        className={`fixed left-0 top-0 h-screen bg-black text-white p-4 transition-all duration-300 overflow-y-auto border-r border-gray-800 ${
          isCompact ? 'w-[70px]' : 'w-[250px]'
        }`}
      >
        {/* Toggle button for mobile/desktop */}
        <div className="flex justify-end mb-4">
          <button 
            className="text-gray-400 hover:text-white focus:outline-none" 
            onClick={() => setIsCompact(!isCompact)}
          >
            {isCompact ? '→' : '←'}
          </button>
        </div>

        <ul className="space-y-4">
          <li>
            <NavLink 
              to="/" 
              className={({isActive}) => `flex items-center ${isCompact ? 'justify-center' : 'space-x-3'} p-2 ${isActive ? 'border border-white' : 'hover:border hover:border-white'} rounded-lg cursor-pointer`}
            >
              <span role="img" aria-label="home" className="text-xl">🏠</span>
              {!isCompact && <span>Home</span>}
            </NavLink>
          </li>

          <li>
            <div
              className={`flex items-center ${isCompact ? 'justify-center' : 'space-x-3'} p-2 ${isSearch ? 'border border-white' : 'hover:border hover:border-white'} rounded-lg cursor-pointer`}
              onClick={() => setIsSearch(!isSearch)}
            >
              <span role="img" aria-label="search" className="text-xl">🔍</span>
              {!isCompact && <span>Chercher</span>}
            </div>
          </li>

          {/* Other menu items */}
          <li>
            <div className={`flex items-center ${isCompact ? 'justify-center' : 'space-x-3'} p-2 hover:border hover:border-white rounded-lg cursor-pointer`}>
              <span role="img" aria-label="explore" className="text-xl">🧭</span>
              {!isCompact && <span>Explorer</span>}
            </div>
          </li>

          <li>
            <div className={`flex items-center ${isCompact ? 'justify-center' : 'space-x-3'} p-2 hover:border hover:border-white rounded-lg cursor-pointer`}>
              <span role="img" aria-label="reels" className="text-xl">▶️</span>
              {!isCompact && <span>Reels</span>}
            </div>
          </li>

          <li>
            <div className={`flex items-center ${isCompact ? 'justify-center' : 'space-x-3'} p-2 hover:border hover:border-white rounded-lg cursor-pointer`}>
              <span role="img" aria-label="messages" className="text-xl">📩</span>
              {!isCompact && <span>Messages</span>}
            </div>
          </li>

          <li>
            <div className={`flex items-center ${isCompact ? 'justify-center' : 'space-x-3'} p-2 hover:border hover:border-white rounded-lg cursor-pointer`}>
              <span role="img" aria-label="notifications" className="text-xl">❤️</span>
              {!isCompact && <span>Notifications</span>}
            </div>
          </li>

          <li>
            <div className={`flex items-center ${isCompact ? 'justify-center' : 'space-x-3'} p-2 hover:border hover:border-white rounded-lg cursor-pointer`}>
              <span role="img" aria-label="create" className="text-xl">➕</span>
              {!isCompact && <span>Créer</span>}
            </div>
          </li>

          <li>
            <NavLink 
              to="/profile" 
              className={({isActive}) => `flex items-center ${isCompact ? 'justify-center' : 'space-x-3'} p-2 ${isActive ? 'border border-white' : 'hover:border hover:border-white'} rounded-lg cursor-pointer`}
            >
              <span role="img" aria-label="profile" className="text-xl">👤</span>
              {!isCompact && <span>Profil</span>}
            </NavLink>
          </li>

          <li>
            <div 
            className={`flex items-center ${isCompact ? 'justify-center' : 'space-x-3'} p-2 ${isSetting ? 'border border-white' : 'hover:border hover:border-white'} rounded-lg cursor-pointer`}
            onClick={() => setIsSetting(!isSetting)}>
              <span role="img" aria-label="settings" className="text-xl">⚙️</span>
              {!isCompact && <span>Paramètres</span>}
            </div>
          </li>
          
        </ul>
      </div>
      
      {/* Render components outside the sidebar and stack them */}
      <div className={`fixed ${isCompact ? 'left-[80px]': 'left-[260px]'} top-4 flex flex-col space-y-40 transition-all duration-300`}>
        {isSearch && <Search setIsSearch={setIsSearch} isCompact={false} />}
        {isSetting && <Settings setIsSetting={setIsSetting} isCompact={false} />} 
      </div>
    </>
  );
};
