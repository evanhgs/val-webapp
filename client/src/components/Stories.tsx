import React, { useRef, useEffect, useState } from "react";
import config from "../config";
import axios from "axios";


interface StoriesProps {
  username?: string | null;
  profile_picture?: string | null;
}
interface UserStories {
  count_user: number | null;
  followed_users?: Array<any>; // changer any par une interface appropriée
}

export const Stories: React.FC<StoriesProps> = ({username, profile_picture}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

   // tableau contenant en premier élément le nombre d'abonnement, les personnes suivies
  const [userStories, setUserStories] = useState<UserStories>({ 
    count_user: null,
    followed_users: []
  });

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

  // hook qui fetch la requete pour afficher tous les users que suit notre main 
  useEffect(() => {
    const getFollower = async () => {
      if (!username) return; 

      try {
        const response = await axios.get(`${config.serverUrl}/user/get-followed/${username}`);
        setUserStories({
          count_user: response.data.count,
          followed_users: response.data.followed,
        });
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };    
    getFollower();
  }, [username]); // ajoute username comme dépendance 

  return (
    <div className="relative border-b border-gray-700 pb-4">
      {/* Boutons de navigation */}
      <button 
        onClick={() => handleScroll('left')} 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 rounded-full p-2 text-white opacity-75 hover:opacity-100"
        style={{ 
          display: 'flex',
          alignItems: 'center', 
          justifyContent: 'center',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      {/* Container avec défilement horizontal */}
      <div className="max-w-md mx-auto">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 p-4 overflow-x-auto hide-scrollbar" 
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
          }}
        >
          {/* Profil utilisateur actuel */}
          {username && (
            <div className="flex flex-col items-center flex-shrink-0 scroll-snap-align-start" style={{ width: '80px', minWidth: '80px' }}>
                <img
                  src={profile_picture ? `${config.serverUrl}/user/profile-picture/${profile_picture}` : `${config.serverUrl}/user/profile-picture/default.jpg`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-gray-600 object-cover"/>

              <span className="text-xs mt-1 text-white truncate w-full text-center">{username}</span>
            </div>
          )}
          
          {/* profils des abonnements */}
          {userStories.followed_users?.map((user, index) => (
            <div key={index} className="flex flex-col items-center flex-shrink-0 scroll-snap-align-start" style={{ width: '80px', minWidth: '80px' }}>
              <img
                src={user.profile_picture ? `${config.serverUrl}/user/profile-picture/${user.profile_picture}` : `${config.serverUrl}/user/profile-picture/default.jpg`}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-gray-600 object-cover"
              />
              <span className="text-xs mt-1 text-white truncate w-full text-center">{user.username}</span>
            </div>
          ))}
          
        </div>
      </div>
      
      {/* Bouton droite */}
      <button 
        onClick={() => handleScroll('right')} 
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 rounded-full p-2 text-white opacity-75 hover:opacity-100"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
         }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};