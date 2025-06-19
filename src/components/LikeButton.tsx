import { useState, useContext, useEffect } from "react";
import { Like, LikeContent } from "../types/like";
import axios from "axios";
import config from "../config";
import { AuthContext } from "../components/AuthContext";
import { useAlert } from './AlertContext';

export const LikeButton: React.FC<Like> = ({ postId }) => {
    const { user } = useContext(AuthContext) || {};
    const token = user?.token;
    const [likeContent, setLikeContent] = useState<LikeContent | undefined>(undefined);

    // utilisation de likeContent pour afficher les informations sur le survol du bouton like
    const { showAlert } = useAlert();

    const [isLiked, setIsLiked] = useState(false);

    const likePost = async () => {
        try {
            await axios.put(
                `${config.serverUrl}/like/${postId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            showAlert("Vous avez liké ce post !", 'success');
            setIsLiked(!isLiked);
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

    const unlikePost = async () => {
        try {
            await axios.delete(
                `${config.serverUrl}/like/${postId}/unlike`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            showAlert("Vous avez unlike ce post !", 'success');
            setIsLiked(!isLiked);
        } catch (error: any) {
            if (error.response) {
                const { status } = error.response;
                switch (status) {
                    case 400:
                        showAlert('Vous avez déjà unliké ce post', 'info');
                        break;
                    case 401:
                        showAlert('Vous devez être connecté pour liker ce post', 'info');
                        break;
                    case 404:
                        showAlert('Post/Like introuvable', 'error');
                        break;
                    case 500:
                        showAlert('Une erreur serveur est survenue', 'error');
                        break;
                }
            }
        }
    };
    const likedByUser = likeContent?.users?.some((u: any) => u.id === user?.id); // boolean check true => déjà liké

    useEffect(() => {
        const likeContentFetch = async () => {
            const response = await axios.get(
                `${config.serverUrl}/like/get-likes/${postId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLikeContent({
                postId: response.data.post_id,
                users: response.data.users,
                likeCount: response.data.likes_count
            });

        }
        likeContentFetch();


    }, [isLiked, likedByUser])

    return (
        <>
            {likedByUser === true ? (
                // post déjà liké
                <button
                    onClick={unlikePost}
                    className='transition-all hover:scale-110 text-red-500'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>{likeContent?.likeCount} likes</span>
                </button>
            ) : (
                // cadre contraire
                <button
                    onClick={likePost}
                    className='transition-all hover:scale-110 text-white hover:text-red-400'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>{likeContent?.likeCount} likes</span>
                </button>
            )}

        </>
    );
}

