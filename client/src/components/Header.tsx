import React from "react";

export const Header: React.FC = () => {
    return (
      <div className="fixed top-0 w-full bg-black text-white p-4 border-b border-gray-700 flex justify-between">
        <h1 className="text-lg font-bold">Valenstagram</h1>
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-800 text-white px-2 py-1 rounded"
        />
      </div>
    );
  };
