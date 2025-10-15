import React from "react";

export const Footer: React.FC = () => {
  return (
    <div className="text-center mt-4 text-gray-500">
      <p className="space-x-4">
        <a href="#" className="hover:underline">A propos</a>
        <a href="#" className="hover:underline">Aide</a>
        <a href="#" className="hover:underline">API</a>
        <a href="#" className="hover:underline">Droits</a>
        <a href="#" className="hover:underline">Termes d'utilisation</a>
        <a href="#" className="hover:underline">Langage</a>
      </p>
      <p className="mt-2">© 2025 Valenstagram from Evan</p>
    </div>
  );
};
