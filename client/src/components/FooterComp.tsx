import React from "react";

export const Footer: React.FC = () => {
  return (
    <div className="text-center mt-4 text-gray-500">
      <p className="space-x-4">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Help</a>
        <a href="#" className="hover:underline">API</a>
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Terms</a>
        <a href="#" className="hover:underline">Language</a>
      </p>
      <p className="mt-2">© 2025 Valenstagram from Evan</p>
    </div>
  );
};
