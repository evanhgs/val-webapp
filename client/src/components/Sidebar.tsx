import React, {useState} from "react";
import { NavLink } from "react-router-dom";


export const Sidebar: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* menu hamburger */}
      <button
        className="md:hidden text-white p-2 fixed top-4 left-4 z-50"
        onClick={() => setIsOpen}>
          {isOpen ? "❌" : "🍔"}
        </button>

      <div className={`fixed left-0 top-0 h-screen w-[250px] bg-black text-white p-4 transition-transform duration-300 md:overflow-y-scroll
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-[250px] md:block  `}>

        <h1 className="text-2xl font-bold mb-6 cursor-pointer">Valenstagram</h1>
        <ul className="space-y-4">
          <li>
          <NavLink to="/" className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
            <span role="img" aria-label="home">🏠</span> <span>Home</span>
            </NavLink>
          </li>
          <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
            <span role="img" aria-label="search">🔍</span> <span>Chercher</span>
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
      {/* Overlay noir pour fermer le menu en mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};
