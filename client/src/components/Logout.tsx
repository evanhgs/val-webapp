import React from "react";
import { useNavigate } from "react-router-dom";
 
export const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
    <div>
        <button onClick={handleLogout} className="cursor-pointer">LOGOUT</button>
    </div>
    );


}