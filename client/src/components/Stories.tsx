import React, { useRef } from "react";
import config from "../config";

interface StoriesProps {
  username?: string | null;
  profile_picture?: string | null;
}

export const Stories: React.FC<StoriesProps> = ({username, profile_picture}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; 
      const scrollPosition = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative border-b border-gray-700 pb-4">
      {/* Boutons de navigation */}
      <button 
        onClick={() => handleScroll('left')} 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 rounded-full p-2 text-white opacity-75 hover:opacity-100"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      {/* Container avec défilement horizontal */}
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 p-4 overflow-x-auto hide-scrollbar" 
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory' 
        }}
      >
        {/* Profil utilisateur actuel */}
        {username && (
          <div className="flex flex-col items-center mr-4 flex-shrink-0 scroll-snap-align-start" style={{ width: '80px' }}>
              <img
                src={profile_picture ? `${config.serverUrl}/user/profile-picture/${profile_picture}` : `${config.serverUrl}/user/profile-picture/default.jpg`}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-gray-600 object-cover"/>

            <span className="text-xs mt-1 text-white truncate w-full text-center">{username}</span>
          </div>
        )}
        
        {/* Autres profils (placeholders) */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0 scroll-snap-align-start" style={{ width: '80px' }}>
            <div className="w-16 h-16 bg-gray-500 rounded-full" />
            <span className="text-xs mt-1 text-white truncate w-full text-center">user{i+1}</span>
          </div>
        ))}
      </div>
      
      {/* Bouton droite */}
      <button 
        onClick={() => handleScroll('right')} 
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 rounded-full p-2 text-white opacity-75 hover:opacity-100"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};