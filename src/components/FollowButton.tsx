import React from 'react';
import config from "../config";

interface FollowUser {
    username: string;
    //profile_picture?: string;
}
interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

interface FollowButtonProps {
    user: FollowUser;
    setAlert: React.Dispatch<React.SetStateAction<AlertProps | null >>;
}

const FollowButton = ({user, setAlert}: FollowButtonProps) => {
    const followUser = (e: React.MouseEvent) => {
        e.stopPropagation(); // bloque la navigation lors du clic
        const token = localStorage.getItem('token');
        if (!token) {
            setAlert({
                message: "Vous devez être connecté pour suivre un utilisateur",
                type: 'error'
            });
            return;
        }
        
        const response = fetch(`${config.serverUrl}/follow/user`, { 
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
            username_other: user.username
            })
        })
        .then(async response => { 
            const data = await response.json();
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
            } else if (data.message === "User not found") {
                setAlert({
                message: "L'utilisateur n'a pas été trouvé",
                type: 'info'
                });
            } else if (data.message === "Unauthorized") {
                setAlert({
                message: "Il faut être connecté pour s'abonner à un utilisateur",
                type: 'error'
                });
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
        .catch(error => {
            console.error("Erreur réseau:", error);
            setAlert({
            message: "Erreur réseau lors de l'abonnement",
            type: 'error'
            });
        });
        console.log(response);
    };
    
    return (
        <button 
            onClick={followUser}
            className="ml-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium text-white">
            Follow
        </button>
    );
};
    
export default FollowButton;