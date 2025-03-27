import config from "../config";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";

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
    useEffect(() => {
        if (alert){
            const timer = setTimeout(()=> {
                setAlert(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alert])

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
        .then(response => {
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
            {alert && (
                <div 
                    className={`absolute top-4 left-1/2 transform -translate-x-1/2 rounded-md px-4 py-2 shadow-lg text-white text-sm font-medium z-50 transition-all duration-300 ${
                        alert.type === 'success' ? 'bg-green-500' : 
                        alert.type === 'error' ? 'bg-red-500' : 'bg-orange-400'
                    }`}
                    style={{ minWidth: '200px', maxWidth: '80%' }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {alert.type === 'success' && (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                            {alert.type === 'error' && (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            {alert.type === 'info' && (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span>{alert.message}</span>
                        </div>
                        <button 
                            onClick={() => setAlert(null)} 
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

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

