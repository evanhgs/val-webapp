import React from "react";
import { useNavigate } from "react-router-dom";
 
export const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
    <div className="flex justify-center">
        <button 
            onClick={handleLogout} 
            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors focus:outline-none"
        >
            Se déconnecter
        </button>
    </div>
    );


}