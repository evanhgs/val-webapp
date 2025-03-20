import React, {useEffect, useState, useCallback} from 'react';
import axios from "axios";
import config from "../config";
import { FollowersModal } from './FollowersModal';


interface SearchProps {
  setIsSearch: (isSearch: boolean) => void;
}
interface FollowUser {
  id: string;
  username: string;
  profilePicture: string;
}


const Search: React.FC<SearchProps> = ({setIsSearch}) => {

  const [showSearchResult, setShowSearchResult] = useState(false); 
  const [input, setInput] = useState<string>(''); // input est la valeur que l'utilisateur à rentré dans la recherche
  const [searchResult, setSearchResult] = useState<{ users: FollowUser[] }>({
    users: []
  }); // le résultat retourné sous format de tableau

  const handleSubmit = async () => {
    if (!input?.trim()) return;
    try {
      const response = await axios.get(
        `${config.serverUrl}/user/search/${input}`
      );
      setSearchResult({ // récupere la liste des utilisateurs (username et pp inclut dans le tableau) + test si une réponse est donné sinon affiche msg
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
    }
  };
  
  

  return (
    <div className="max-w-[900px] w-full flex flex-col items-center">
      <div className="w-full">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3">
              <button
              className="text-gray-500 hover:text-blue-700 focus:outline-none"
              onClick={() => setIsSearch(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
              </button>
            </div>
            <input 
              type="search" 
              id="default-search" 
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Chercher un pseudo"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter') {
                  handleSubmit(); 
                }}}/>
            <button 
              type="submit" 
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleSubmit}
              >Chercher</button>
          </div>
        </div>
        {showSearchResult && (
        <FollowersModal 
          users={searchResult.users}
          title="Résultat(s)" 
          onClose={() => setShowSearchResult(false)} 
        />
      )}
    </div>
  )
}
export default Search;