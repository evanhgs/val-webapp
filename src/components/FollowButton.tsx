import React from 'react';
import config from "../config";
import { useAlert } from './AlertContext';
import { FollowButtonProps } from '../types/followProps';

const FollowButton = ({user}: FollowButtonProps) => {
    const { showAlert } = useAlert();
    const followUser = (e: React.MouseEvent) => {
        e.stopPropagation(); // bloque la navigation lors du clic
        const token = localStorage.getItem('token');
        if (!token) {
            showAlert("Vous devez être connecté pour suivre un utilisateur", "error");
            return;
        }
        
        fetch(`${config.serverUrl}/follow/user`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                username_other : user.username
            })
        })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                if (data.message === "Already following") {
                    showAlert("Vous suivez déjà cet utilisateur", 'info');
                } else if (data.message === "You can't follow yourself") {
                    showAlert("Vous ne pouvez pas vous suivre vous-même", 'error');
                } else if (data.message === "User not found") {
                    showAlert("L'utilisateur n'a pas été trouvé", 'info');
                } else if (data.message === "Unauthorized") {
                    showAlert("Il faut être connecté pour s'abonner à un utilisateur", 'error');
                } else {
                    showAlert("Erreur lors de l'abonnement", 'error');
                }
            } else {
                showAlert("Abonnement réussi", 'success');
            }
        })
        .catch(error => {
            console.error("Erreur réseau:", error);
            showAlert("Erreur réseau lors de l'abonnement", 'error');
        });
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