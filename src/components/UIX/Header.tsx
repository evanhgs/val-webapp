import React from "react";

export const Header: React.FC = () => {
  return (
    <div className="w-full text-white h-16 md:h-20 border-b border-gray-800 flex items-center px-4">
      <div className="w-full max-w-screen-xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">Valenstagram</h1>
      </div>
    </div>
  );
};