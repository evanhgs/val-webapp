import React from "react";

export const Stories: React.FC = () => {
    return (
      <div className="flex space-x-4 p-4 border-b border-gray-700 space-y-4 overflow-x-auto">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="w-16 h-16 bg-gray-500 rounded-full"></div>
        ))}
      </div>
    );
  };

  