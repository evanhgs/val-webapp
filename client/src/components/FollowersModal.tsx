import config from "../config";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { AlertPopup } from "./AlertPopup";

interface FollowUser {
    username: string;
    profile_picture?: string;
}
interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'info';
}


// pop up des listes des abonnés / abonnements
export const FollowersModal = ({ users, title, onClose }: { users: FollowUser[], title: string, onClose: () => void }) => {
    const navigate = useNavigate();
    const foreignProfile = (username: string): void => {
        navigate(`/profile/${username}`);
    };

    const [alert, setAlert] = useState<AlertProps | null>(null);

    const followUser = (e: React.MouseEvent, user: FollowUser) => {
        e.stopPropagation(); // bloque la navigation lors du clic
        const token = localStorage.getItem('token');
        if (!token) {
            setAlert({
                message: "Vous devez être connecté pour suivre un utilisateur",
                type: 'error'
            });
            return;
        }
        
        fetch(`${config.serverUrl}/user/follow`, { // route for follow an user
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // must get the jwt in header
            },
            body: JSON.stringify({
                username_other: user.username
            })
        })
        .then(response => { // utilisation de la popup en fonction des messages d'erreur (utile)
            return response.json().then(data => {
                if (!response.ok) {
                    if (data.message === "Already following") {
                        setAlert({
                            message: "Vous suivez déjà cet utilisateur",
                            type: 'info'
                        });
                    } else if (data.message === "You can't follow yourself") {
                        setAlert({
                            message: "Vous ne pouvez pas vous suivre vous-même",
                            type: 'error'
                        });
                    } else if ( data.message === "User not found") {
                        setAlert({
                            message: "L'utilisateur n'a pas été trouvé",
                            type: 'info'
                        })
                    } else if ( data.message === "Unauthorized") {
                        setAlert({
                            message: "Il faut être connecté pour s'abonner à un utilisateur",
                            type: 'error'
                        })
                    } else {
                        setAlert({
                            message: "Erreur lors de l'abonnement",
                            type: 'error'
                        });
                    }
                } else {
                    setAlert({
                        message: "Abonnement réussi",
                        type: 'success'
                    });
                }
            })
        })
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">

            {/* Alerte stylisée qui apparaît en haut de la modal */}
            {alert && <AlertPopup message={alert.message} type={alert.type}/>}

            <div className="bg-gray-800 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="text-xl">×</button>
                </div>
                <div className="p-4">
                    {users.length === 0 ? (
                    <p className="text-center text-gray-400">Aucun résultat</p>
                    ) : (
                    users.map((user, index) => (
                        <div 
                            key={index} 
                            className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md cursor-pointer"
                            onClick={() => {
                                foreignProfile(user.username);
                                onClose();
                            }}
                        >
                            <img 
                                src={user.profile_picture ? `${config.serverUrl}/user/profile-picture/${user.profile_picture}` : `${config.serverUrl}/user/profile-picture/default.jpg`}
                                alt={user.username} 
                                className="w-10 h-10 rounded-full"
                            />
                            <span>{user.username}</span>
                            <button 
                                onClick={(e) => followUser(e, user)}
                                className="ml-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
                            >
                                Follow
                            </button>
                        </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

