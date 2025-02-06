import React from "react";

export const Sidebar: React.FC = () => {

  // la sidebar peut avoir plusieurs états quand les éléments sont cliqués
  // TODO: 
  return (
    <div className="w-[250px] h-screen bg-black text-white p-4 fixed left-0">
      <h1 className="text-2xl font-bold mb-6">Valenstagram</h1>
      <ul className="space-y-4">
        <li className="flex items-center space-x-3">
          <span role="img" aria-label="home">🏠</span> <span>Home</span>
        </li>
        <li className="flex items-center space-x-3">
          <span role="img" aria-label="search">🔍</span> <span>Search</span>
        </li>
        <li className="flex items-center space-x-3">
          <span role="img" aria-label="notifications">❤️</span> <span>Notifications</span>
        </li>
        <li className="flex items-center space-x-3">
          <span role="img" aria-label="profile">👤</span> <span>Profile</span>
        </li>
      </ul>
    </div>
  );
};
