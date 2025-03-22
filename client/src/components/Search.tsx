import React, { useState } from 'react';
import axios from "axios";
import config from "../config";
import { FollowersModal } from './FollowersModal';

interface SearchProps {
  setIsSearch: (isSearch: boolean) => void;
  isCompact?: boolean;
}

interface FollowUser {
  id: string;
  username: string;
  profilePicture: string;
}

const Search: React.FC<SearchProps> = ({ setIsSearch, isCompact }) => {
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{ users: FollowUser[] }>({
    users: []
  });

  const handleSubmit = async () => {
    if (!input?.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${config.serverUrl}/user/search/${input}`
      );
      setSearchResult({
        users: response.data.users.length > 0 
        ? response.data.users 
        : [{ 
            id: "0", 
            username: "Personne n'a été trouvé", 
            profilePicture: `${config.serverUrl}/user/profile-picture/default.jpg` 
          }]
      });
      setShowSearchResult(true);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSearchResult({
        users: [{ 
          id: "0", 
          username: "Personne n'a été trouvé", 
          profilePicture: `${config.serverUrl}/user/profile-picture/default.jpg` 
        }]
      });
      setShowSearchResult(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`search-container ${isCompact ? 'fixed left-[80px]' : 'fixed left-[260px]'} top-4 transition-all duration-300`}>
      <div className="w-[300px] bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Recherche</h3>
          <button 
            onClick={() => setIsSearch(false)}
            className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="relative">
          <input 
            type="search" 
            id="default-search" 
            className="block w-full p-3 ps-4 text-sm text-white border border-gray-600 rounded-lg bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Chercher un pseudo"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { 
              if (e.key === 'Enter') {
                handleSubmit(); 
              }
            }}
          />
          <button 
            type="submit" 
            className={`absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded px-4 py-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Chercher'}
          </button>
        </div>
        
        {input.trim() && (
          <div className="mt-2 text-xs text-gray-400">
            Recherche pour: "{input}"
          </div>
        )}
      </div>

      {showSearchResult && (
        <FollowersModal 
          users={searchResult.users}
          title="Résultat(s)" 
          onClose={() => setShowSearchResult(false)} 
        />
      )}
    </div>
  );
};

export default Search;