    import { useState, useContext, useEffect } from "react";
    import { AuthContext } from "./AuthContext.tsx";
    import { useAlert } from './AlertContext';
    import {ApiEndpoints, AxiosInstance} from "../services/apiEndpoints.ts";
    import {LikesFromPost} from "../types/like.ts";

    export const PostActions = ({ postId }: { postId: number}) => {

        const { user } = useContext(AuthContext) || {};
        const [likeContent, setLikeContent] = useState<LikesFromPost | undefined>(undefined);
        const { showAlert } = useAlert();

        const fetchLikes = async () => {
            const response = await AxiosInstance.get(ApiEndpoints.like.getPostLikes(postId))
            setLikeContent({
                postId: response.data.post_id,
                likesCount: response.data.likes_count,
                users: response.data.users,
            });
        };
        // boolean check true => already liked by current user
        const likedByUser = likeContent?.users?.some((u) => Number(u.id) === Number(user?.id));


        const likePost = async () => {
            if (!user) {
                showAlert('Vous devez être connecté pour liker ce post', 'info');
                return;
            }
            const prevState = likeContent;
            // Optimistic UI update
            setLikeContent((prev) =>
                prev
                    ? {
                        ...prev,
                        likesCount: prev.likesCount + 1,
                        users: [...prev.users, {
                            id: user.id,
                            username: user.username,
                            profile_picture: user.profilePicture
                        }],
                    }
                    : prev
            );

            try {
                await AxiosInstance.post(ApiEndpoints.like.likePost(postId));
                showAlert("Vous avez liké ce post !", 'success');
            } catch (error: unknown) {
                setLikeContent(prevState);
                const err = error as { response?: { status: number } };
                if (err.response) {
                    const { status } = err.response;
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
            if (!user) {
                showAlert('Vous devez être connecté pour unliker ce post', 'info');
                return;
            }
            const prevState = likeContent;
            setLikeContent((prev) =>
                prev
                    ? {
                        ...prev,
                        likesCount: prev.likesCount - 1,
                        users: prev.users.filter((u) => Number(u.id) !== Number(user.id)),
                    }
                    : prev
            );
            try {
                await AxiosInstance.delete(ApiEndpoints.like.unlikePost(postId));
                showAlert("Vous avez unlike ce post !", 'success');
            } catch (error: unknown) {
                setLikeContent(prevState);
                const err = error as { response?: { status: number } };
                if (err.response) {
                    const { status } = err.response;
                    switch (status) {
                        case 400:
                            showAlert('Vous avez déjà unliké ce post', 'info');
                            break;
                        case 401:
                            showAlert('Vous devez être connecté pour liker ce post', 'info');
                            break;
                        case 404:
                            showAlert('Post/PostActions introuvable', 'error');
                            break;
                        case 500:
                            showAlert('Une erreur serveur est survenue', 'error');
                            break;
                    }
                }
            }
        };

        useEffect(() => {
            fetchLikes();
        }, [postId]);

        console.log("user.id type:", typeof user?.id, user?.id);
        console.log("api users ids:", likeContent?.users.map(u => typeof u.id));


        return (
            <>

                {likedByUser ? (
                    // post déjà liké -> unlike
                    <>
                        <button className="btn btn-circle" onClick={unlikePost}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ef4444" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#ef4444" className="size-[1.2em]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </button>
                        <span>{likeContent?.likesCount} likes</span>
                    </>

                ) : (
                    // cas contraire -> like
                    <>
                        <button className="btn btn-circle btn-active" onClick={likePost}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                        </button>
                        <span>{likeContent?.likesCount} likes</span>
                    </>
                )}
                <button className="btn focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
                <button className="btn focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </button>
            </>
        );
    }

