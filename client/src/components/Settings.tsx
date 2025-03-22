import React from 'react';
import { Logout } from "../components/Logout"; 

interface SearchProps {
  setIsSetting: (isSearch: boolean) => void;
  isCompact?: boolean;
}


const Settings: React.FC<SearchProps> = ({ setIsSetting, isCompact }) => {
  
  return (
    <div className={`search-container ${isCompact ? 'fixed left-[80px]' : 'fixed left-[260px]'} top-4 transition-all duration-300`}>
      <div className="w-[300px] bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Paramètres</h3>
          <button 
            onClick={() => setIsSetting(false)}
            className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="relative">
            <Logout />
        </div>
        
      </div>
    </div>
  );
};

export default Settings;