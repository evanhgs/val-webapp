import { useState, useContext } from "react";
import { Like } from "../types/like";
import axios from "axios";
import config from "../config";
import { AuthContext } from "../components/AuthContext";
import { useAlert } from './AlertContext';

export const LikeButton: React.FC<Like> = ({ postId }) => {
    const { user } = useContext(AuthContext) || {};
    const token = user?.token;
    const [likeContent, setLikeContent] = useState<Like | null>(null);
    // utilisation de likeContent pour afficher les informations sur le survol du bouton like
    const { showAlert } = useAlert();

    const likePost = async () => {
        try {
            const response = await axios.put(
                `${config.serverUrl}/like/${postId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLikeContent({
                id: response.data.like_id,
                userId: response.data.user_id,
                postId: response.data.post_id,
                createdAt: response.data.created_at
            })
            showAlert("Vous avez liké ce post !", 'success');
        } catch (error: any) {
            if (error.response) {
                const { status } = error.response;
                switch (status) {
                    case 400:
                        showAlert('Vous avez déjà liké ce post', 'info');
                        break;
                    case 401:
                        showAlert('Vous devez être connecté pour liker ce post', 'info');
                        break;
                    case 404:
                        showAlert('Post introuvable', 'error');
                        break; 
                    case 500:
                        showAlert('Une erreur serveur est survenue', 'error');
                        break;
                }
            }
        }
    };
    

    return (
        <>
            <button
                onClick={likePost}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
        </>
    );
}

