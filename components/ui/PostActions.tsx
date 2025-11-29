'use client';

import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/components/providers/AuthProvider";
import {useAlert} from "@/components/providers/AlertContext";
import {LikesFromPost} from "@/types/Like";
import {CommentDTO, CommentsContent} from "@/types/Comment";
import {useRouter} from "next/navigation";
import {ApiEndpoints, AxiosInstance, FRONTEND_URL} from "@/lib/endpoints";
import {UserLightDTO} from "@/types/User";
import {pipeDate} from "@/lib/pipe-dates";
import {CommentSettings} from "@/components/ui/CommentSettings";

export const PostActions = ({ postId }: { postId: number}) => {

    const { user } = useContext(AuthContext) || {};
    const [likeContent, setLikeContent] = useState<LikesFromPost | undefined>(undefined);
    const [commentContent, setCommentContent] = useState<CommentsContent | undefined>(undefined);
    const { showAlert } = useAlert();
    const navigate = useRouter();
    const [valueInside, setValueInside] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    const fetchLikes = async () => {
        const response = await AxiosInstance.get(ApiEndpoints.like.getPostLikes(postId))
        setLikeContent({
            postId: response.data.post_id,
            likes_count: response.data.likes_count,
            users: response.data.users,
        });
    };
    const likedByUser = likeContent?.users?.some((u) => Number(u.id) === Number(user?.id));

    const fetchComments = async () => {
        try {
            const response = await AxiosInstance.get(ApiEndpoints.comment.getComments(postId));

            if (response.status === 401) {
                showAlert('Vous devez vous connecter pour voir les commentaires', 'info');
            } else {
                setCommentContent({
                    comments: response.data.contents,
                    count: response.data.count,
                });
            }
        } catch (error) {
            const err = error as { response?: { status: number } };
            if (err.response?.status === 401) {
                showAlert('Vous devez vous connecter pour voir les commentaires', 'info');
            } else {
                showAlert('Erreur lors du chargement des commentaires', 'error');
            }
            console.error('Error fetching comments:', error);
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.preventDefault();
        setValueInside(e.target.value);
    }

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
                    likes_count: prev.likes_count + 1,
                    users: [...prev.users, {
                        id: user.id,
                        username: user.username,
                        profile_picture: user.profile_picture
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
                    likes_count: prev.likes_count - 1,
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
        fetchComments();
    }, [postId]);

    return (
        <div className="flex items-center justify-between px-6 w-full py-4">
            {/** likes logo & modal */}
            <div className="flex items-center gap-3">
                {likedByUser ? (
                    <button
                        className="btn btn-ghost hover:bg-white/5 transition-all duration-300 hover:scale-110 active:scale-95 rounded-xl"
                        onClick={unlikePost}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ef4444" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#ef4444" className="size-6 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </button>
                ) : (
                    <button
                        className="btn btn-ghost hover:bg-white/5 transition-all duration-300 hover:scale-110 active:scale-95 rounded-xl"
                        onClick={likePost}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </button>
                )}

                {/** likes modal */}
                <div className="dropdown dropdown-top dropdown-center">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost hover:bg-white/5 transition-all duration-300 rounded-xl font-medium"
                    >
                        {likeContent?.likes_count} likes
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-zinc-900 border border-white/5 rounded-2xl z-[100] w-64 p-3 shadow-[0_8px_30px_rgba(255,255,255,0.08)] backdrop-blur-sm"
                    >
                        {likeContent?.users && likeContent.likes_count > 0 ? (
                            <div className="space-y-2 max-h-72 overflow-y-auto">
                                {likeContent.users.map((u: UserLightDTO) => (
                                    <li key={u.id}>
                                        <div
                                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer active:scale-95"
                                            onClick={() => { navigate.push(`/profile/${u.username}`) }}
                                        >
                                            <img
                                                className="w-10 h-10 rounded-full border border-white/10 shadow-lg"
                                                alt={u.username}
                                                src={u.profile_picture ? ApiEndpoints.user.picture(u.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                            />
                                            <span className="font-medium text-sm">{u.username}</span>
                                        </div>
                                    </li>
                                ))}
                            </div>
                        ) : (
                            <p className="py-6 text-center italic text-zinc-500 text-sm">Aucun like pour le moment</p>
                        )}
                    </ul>
                </div>
            </div>

            {/** comments logo & modal */}
            <div className="flex items-center gap-3">
                <button
                    className="btn btn-ghost hover:bg-white/5 transition-all duration-300 rounded-xl font-medium gap-2"
                    onClick={() => (document.getElementById('comment_modal') as HTMLDialogElement).showModal()}
                >
                    {commentContent?.count}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>

                <dialog id="comment_modal" className="modal">
                    <div className="modal-box bg-zinc-900 border border-white/5 rounded-2xl shadow-[0_20px_60px_rgba(255,255,255,0.1)] max-w-2xl">
                        <h3 className="font-bold text-xl mb-6">Tous les commentaires</h3>
                        <form method="dialog">
                            <button className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3 hover:bg-white/10 transition-all duration-300 rounded-full">✕</button>

                            {commentContent?.comments && commentContent.count > 0 ? (
                                <div className="max-h-96 overflow-y-auto mb-6 space-y-4 px-2">
                                    {commentContent?.comments.map((c: CommentDTO) => (
                                        <div key={c.id} className="chat chat-start">
                                            <div className="chat-image avatar">
                                                <div className="w-11 rounded-full border border-white/10 shadow-lg">
                                                    <img
                                                        alt={c.user.username}
                                                        src={c.user.profile_picture ? ApiEndpoints.user.picture(c.user.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 w-full">
                                                <div className="flex-1">
                                                    <div className="chat-header mb-1">
                                                        <span className="font-semibold">{c.user.username}</span>
                                                        <time className="text-xs opacity-60 ml-2">
                                                            {pipeDate(c.created_at) || 'dd/MM/YYYY'}
                                                        </time>
                                                    </div>
                                                    <div className="chat-bubble bg-zinc-800 border border-white/5 text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] rounded-xl break-all whitespace-pre-wrap">
                                                        {c.content}
                                                    </div>
                                                </div>
                                                <div className="self-center mt-6">
                                                    <CommentSettings comment={c} fetchComments={fetchComments} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center italic text-zinc-500">Aucun commentaire pour le moment</p>
                            )}

                            {/* add comment */}
                            <div className="flex items-end gap-3 border-t border-white/5 pt-6 mt-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-2 text-zinc-400">
                                        Écrire un commentaire : <span className="text-zinc-500">{valueInside.length} / 500</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="commentInput"
                                        className="input input-bordered w-full bg-zinc-800 border-white/5 focus:border-white/20 focus:ring-2 focus:ring-white/10 rounded-xl shadow-inner transition-all duration-300"
                                        placeholder="Partage des bonnes nouvelles"
                                        maxLength={500}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button
                                    className="btn bg-white text-zinc-900 hover:bg-white/90 border-none rounded-xl shadow-[0_4px_16px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95 font-semibold px-6"
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById("commentInput") as HTMLInputElement | null;
                                        const value = input?.value.trim() || "";
                                        if (!value) {
                                            showAlert("Le commentaire ne peut pas être vide", 'info');
                                            return;
                                        }
                                        AxiosInstance.post(ApiEndpoints.comment.addComment(postId), {
                                            content: value,
                                        })
                                            .then(() => {
                                                showAlert("Commentaire ajouté !", 'success');
                                                fetchComments();
                                                if (input) input.value = "";
                                                setValueInside("");
                                            })
                                            .catch((error: unknown) => {
                                                const err = error as { response?: { status: number } };
                                                if (err.response) {
                                                    const { status } = err.response;
                                                    switch (status) {
                                                        case 400:
                                                            showAlert('Le commentaire est invalide', 'info');
                                                            break;
                                                        case 401:
                                                            showAlert('Vous devez être connecté pour commenter ce post', 'info');
                                                            break;
                                                        case 404:
                                                            showAlert('Post introuvable', 'error');
                                                            break;
                                                        case 500:
                                                            showAlert('Une erreur serveur est survenue', 'error');
                                                            break;
                                                    }
                                                }
                                            });
                                    }}
                                >
                                    Envoyer
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            </div>

            <div className="tooltip tooltip-top" data-tip={copied ? "Copié !" : "Copier le lien"}>
                <button
                    className="btn btn-ghost hover:bg-white/5 transition-all duration-300 hover:scale-110 active:scale-95 rounded-xl"
                    onClick={async () => {
                        await navigator.clipboard.writeText(`${FRONTEND_URL}/post/${postId}`)
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

