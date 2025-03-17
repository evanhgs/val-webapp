import React from "react";

export const Suggestions: React.FC = () => {
    return (
      <div className="w-[300px] text-white p-4">
        <h2 className="text-lg font-bold mb-4">Suggestions pour vous</h2>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center mb-2">
            <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
            <button className="text-blue-500">S'abonner</button>
          </div>
        ))}
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