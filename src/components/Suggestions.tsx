import React from "react";
import { Footer } from "../components/FooterComp";

export const Suggestions: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 relative">
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Suggestions pour vous</h2>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img 
                src={`/api/placeholder/${40}/${40}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border border-gray-700"
              />
              <div className="ml-3">
                <p className="text-sm font-semibold">utilisateur_{i+1}</p>
                <p className="text-xs text-gray-400">Suggestions pour vous</p>
              </div>
            </div>
            <button className="text-blue-500 text-xs font-semibold hover:text-blue-400">
              Suivre
            </button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

{/**
  Pour faire ce composant il faut que je créé une route qui permet de savoir 
  si un utilisateur est follow avec celui qui est connecté (pour me simplifier)
  Et ensuite je passe cette requete en condition c'est à dire que je vais afficher
  les premiers users qui sont succeptibles d'avoir une relation plus forte, donc 
  ceux avec les abonnés en communs le plus élevé par ordre croissant.
   
  */}