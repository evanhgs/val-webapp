import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";


export const PostSettings = ({postOwner}: {postOwner: string}) => {

    const { user } = useContext(AuthContext) || {}; // token 
    ////// to do stocker dans le contexte l'id du mec
    const [isOpen, setIsOpen] = useState(false);
    
    if (postOwner === user?.username) {
    return (
        <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-gray-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
            </svg>
        </button>
        
        {isOpen && (
            <div className="absolute right-0 top-8 bg-gray-800 rounded-md shadow-lg p-2 z-20 w-40 border border-gray-700">
            <div className="flex justify-between items-center border-b border-gray-700 pb-1 mb-2">
                <span className="text-sm font-medium">Options</span>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">×</button>
            </div>
            
            <button 
                onClick={() => {
                    console.log("Modifier le post");
                    setIsOpen(false);
                }}
                className="w-full text-left p-2 text-sm hover:bg-gray-700 rounded flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Modifier
            </button>
            
            <button 
                onClick={() => {
                    console.log("Supprimer le post");
                    setIsOpen(false);
                }}
                className="w-full text-left p-2 text-sm text-red-400 hover:bg-gray-700 rounded flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Supprimer
            </button>
            </div>
        )}
        </div>
    );
    } else {
        return (
            <>
                <p>😵</p>
            </>
        );
    }

}

