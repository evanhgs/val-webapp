import React from 'react';
import { Logout } from "../components/Logout"; 
import UseOutsideClickDetector from './OutsideClickDetector'


interface SearchProps {
  setIsSetting: (isSearch: boolean) => void;
  isCompact?: boolean;
}

const Settings: React.FC<SearchProps> = ({ setIsSetting, isCompact }) => {

  const settingContainerRef = UseOutsideClickDetector(() => {
    setIsSetting(false);
  });
  
  return (
    <div className={`search-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-50`}
      ref={settingContainerRef}>
      <div className={`bg-gray-800 p-4 rounded-lg shadow-lg ${isCompact ? 'w-[250px]' : 'w-[350px]'}`}>
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