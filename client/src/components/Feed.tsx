  import React from "react";

export const Feed: React.FC = () => {
    return (
      <div className="flex flex-col items-center space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-[500px] bg-gray-800 p-4 rounded-md">
            <div className="h-[400px] bg-gray-600"></div>
            <p className="text-white mt-2">Caption du post...</p>
          </div>
        ))}
      </div>
    );
  };

  