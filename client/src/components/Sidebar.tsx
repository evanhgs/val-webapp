import React, {useState} from "react";
import { NavLink } from "react-router-dom";
import Search  from './Search';


export const Sidebar: React.FC = () => {


  const [isSearch, setIsSearch] = useState(false);




  return (
    <>
      <div className='fixed left-0 top-0 h-screen w-[250px] bg-black text-white p-4 transition-transform duration-300 md:overflow-y-scroll'>
        <ul className="space-y-4">

          <li>
            <NavLink to="/" className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
              <span role="img" aria-label="home">🏠</span> <span>Home</span>
            </NavLink>
          </li>

          <li>
              {isSearch ? ( <Search /> ) : (
                <div>
                  <button
                    className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer"
                    onClick={() => setIsSearch(true)}> 
                    <span role="img" aria-label="search">🔍</span> <span>Chercher</span>
                  </button>
                </div>
              ) }
          </li>

          <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
            <span role="img" aria-label="search">🧭</span> <span>Explorer</span>
          </li>
          <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
            <span role="img" aria-label="search">▶️</span> <span>Reels</span>
          </li>
          <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
            <span role="img" aria-label="search">📩</span> <span>Messages</span>
          </li>
          <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
            <span role="img" aria-label="notifications">❤️</span> <span>Notifications</span>
          </li>
          <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
            <span role="img" aria-label="notifications">➕</span> <span>Créer</span>
          </li>
          <li>
            <NavLink to="/profile" className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
              <span role="img" aria-label="profile">👤</span> <span>Profil</span>
            </NavLink>
          </li>
          <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
            <span role="img" aria-label="profile">⚙️</span> <span>Paramètres</span>
          </li>
        </ul>
      </div>
      
    </>
  );
};
