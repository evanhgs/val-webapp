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
