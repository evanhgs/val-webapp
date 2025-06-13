import React from 'react';
import config from "../config";
import { useAlert } from './AlertContext';
import { FollowButtonProps } from '../types/followProps';

const FollowButton = ({ user, isFollowed }: FollowButtonProps) => {
    const { showAlert } = useAlert();
    const token = localStorage.getItem('token');

    const followUser = (e: React.MouseEvent) => {
        e.stopPropagation(); // bloque la navigation lors du clic
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
                username_other: user.username
            })
        })
            .then(async response => {
                if (!response.ok) {
                    const status = response.status;
                    switch (status) {
                        case 400: 
                            showAlert('Vous suivez déjà cette personne', 'info');
                            break;
                        case 401:
                            showAlert('Authentification requise', 'error');
                            break;
                        case 402:
                            showAlert('Vous pouvez pas vous suivre vous même', 'info');
                            break;
                        case 404:
                            showAlert('Utilisateur non trouvé', 'error');
                            break;
                        case 500:
                            showAlert('Erreur serveur', 'error');
                            break;
                        default:
                            showAlert('Une erreur est survenue', 'error');
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


    const unFollowUser = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!token) {
            showAlert("Vous devez être connecté pour ne plus suivre un utilisateur", "error");
            return;
        }

        fetch(`${config.serverUrl}/follow/unfollow`, {
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
                if (!response.ok) {
                    const status = response.status;
                    switch (status) {
                        case 401:
                            showAlert('Authentification requise', 'error');
                            break;
                        case 404:
                            showAlert('Vous vous êtes déjà désabonné', 'info');
                            break;
                        case 500:
                            showAlert('Erreur serveur', 'error');
                            break;
                        default:
                            showAlert('Une erreur est survenue', 'error');
                    }
                } else {
                    showAlert("Désabonnement réussi", 'success');
                }
            })
            .catch(error => {
                console.error("Erreur réseau:", error);
                showAlert("Erreur réseau lors de l'abonnement", 'error');
            });
    };

    if (isFollowed === true) {
        return (
            <button
                onClick={unFollowUser}
                className="ml-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium text-white">
                Unfollow
            </button>
        );
    } else {
        return (

            <button
                onClick={followUser}
                className="ml-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium text-white">
                Follow
            </button>
        );
    }

};

export default FollowButton;