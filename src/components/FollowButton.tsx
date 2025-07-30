import React, { useContext, useEffect, useState } from 'react';
import config from "../config";
import { useAlert } from './AlertContext';
import axios, { AxiosError } from 'axios';
import { AuthContext } from './AuthContext';
import {ApiEndpoints} from "../services/apiEndpoints.ts";
import {Follower} from "../types/followProps.ts";

interface FollowButtonProps {
    username: string;
}

// fetch les abonnés de l'utilisateur ciblé et en déduire si afficher "follow"/"followed"
// quand le bouton est cliqué la reqete par et change l'état en direct 
const FollowButton: React.FC<FollowButtonProps> = ({ username }) => {
    const { showAlert } = useAlert();
    const { user } = useContext(AuthContext) || {};
    const token = user?.token;
    const [isFollowed, setIsFollowed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    //refactor axios
    const axiosInstance = axios.create({
    baseURL: config.serverUrl,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer: ${token}` })
    }
  });

    useEffect(() => {
        if (username && user?.username) {
            fetchFollowStatus();
        }
    }, [username, user?.username]);

    // dans un premier temps récupère les abonnés pour afficher l'état du bouton
    const fetchFollowStatus = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(ApiEndpoints.follow.getFollowers(username));
            const followers: Follower[] = response.data?.followers || [];
            // regarde si le current user est abonné à l'utilisateur qu'on affiche le bouton follow
            const checkFollow = followers.some((follower: Follower) => follower.username === user?.username);
            setIsFollowed(checkFollow);
        } catch (error) {
            showAlert(`Une erreur est survenue lors du chargement de l'abonnement, ${error}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // action de follow
    const followUser = async (e: React.MouseEvent) => {
        e.stopPropagation(); // évite la redirection sur le profil
        if (!token) {
            showAlert("Vous devez être connecté pour suivre un utilisateur", "error");
            return;
        }

        try {
            setIsLoading(true);
            await axiosInstance.put(ApiEndpoints.follow.follow(username), {

            });

            setIsFollowed(true);
            showAlert("Abonnement réussi", 'success');
        } catch (error) {
            handleFollowError(error as AxiosError);
        } finally {
            setIsLoading(false);
        }
    };

    // action d'unfollow
    const unFollowUser = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!token) {
            showAlert("Vous devez être connecté pour ne plus suivre un utilisateur", "error");
            return;
        }

        try {
            setIsLoading(true);
            await axiosInstance.put(ApiEndpoints.follow.unfollow(username));

            setIsFollowed(false);
            showAlert("Désabonnement réussi", 'success');
        } catch (error) {
            handleUnfollowError(error as AxiosError);
        } finally {
            setIsLoading(false);
        }
    };

    // Gestion des erreurs pour le follow
    const handleFollowError = (error: AxiosError) => {
        console.error("Erreur lors du suivi:", error);
        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 400:
                    showAlert('Vous suivez déjà cette personne', 'info');
                    setIsFollowed(true);
                    break;
                case 401:
                    showAlert('Authentification requise', 'error');
                    break;
                case 402:
                    showAlert('Vous ne pouvez pas vous suivre vous-même', 'info');
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
        } else if (error.request) {
            showAlert("Erreur réseau lors de l'abonnement", 'error');
        } else {
            showAlert("Une erreur inattendue est survenue", 'error');
        }
    };

    // Gestion des erreurs pour l'unfollow
    const handleUnfollowError = (error: AxiosError) => {
        console.error("Erreur lors du désabonnement:", error);

        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 401:
                    showAlert('Authentification requise', 'error');
                    break;
                case 404:
                    showAlert('Vous vous êtes déjà désabonné', 'info');
                    setIsFollowed(false);
                    break;
                case 500:
                    showAlert('Erreur serveur', 'error');
                    break;
                default:
                    showAlert('Une erreur est survenue', 'error');
            }
        } else if (error.request) {
            showAlert("Erreur réseau lors du désabonnement", 'error');
        } else {
            showAlert("Une erreur inattendue est survenue", 'error');
        }
    };

    if (user?.username === username) {
        return null
    }


    // récupère l'état courant et change l'état du bouton et son action
    return (
        <button
            onClick={isFollowed ? unFollowUser : followUser}
            disabled={isLoading}
            className={`ml-auto px-3 py-1 rounded text-sm font-medium text-white transition-colors duration-200 ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isFollowed
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
        >
            {isLoading ? 'Chargement...' : isFollowed ? 'Se désabonner' : 'Suivre'}
        </button>
    );


};

export default FollowButton;
