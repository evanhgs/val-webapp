    import React, { useState, useContext, useEffect } from "react";
    import { AuthContext } from "./AuthContext.tsx";
    import { useAlert } from './AlertContext';
    import {ApiEndpoints, AxiosInstance} from "../services/apiEndpoints.ts";
    import {LikesFromPost} from "../types/like.ts";
    import {Comment, CommentsContent} from "../types/comment.ts";
    import {pipeDate} from "./PipeDate.ts";
    import {CommentSettings} from "./CommentSettings.tsx";
    import {UserLiteProfile} from "../types/user.ts";
    import {useNavigate} from "react-router-dom";

    export const PostActions = ({ postId }: { postId: number}) => {

        const { user } = useContext(AuthContext) || {};
        const [likeContent, setLikeContent] = useState<LikesFromPost | undefined>(undefined);
        const [commentContent, setCommentContent] = useState<CommentsContent | undefined>(undefined);
        const { showAlert } = useAlert();
        const navigate = useNavigate();
        const [valueInside, setValueInside] = useState<string>('');

        const fetchLikes = async () => {
            const response = await AxiosInstance.get(ApiEndpoints.like.getPostLikes(postId))
            setLikeContent({
                postId: response.data.post_id,
                likes_count: response.data.likes_count,
                users: response.data.users,
            });
        };
        // boolean check true => already liked by current user
        const likedByUser = likeContent?.users?.some((u) => Number(u.id) === Number(user?.id));

        const fetchComments = async () => {
            const response = await AxiosInstance.get(ApiEndpoints.comment.getComments(postId))
            setCommentContent({
                comments: response.data.contents,
                count: response.data.count,
            });
        }

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
            <div className="flex items-center justify-between px-4 w-full">
                {/** likes logo & modal */}
                <div className="flex items-center gap-4">
                    {likedByUser ? (
                        // post déjà liké -> unlike
                        <>
                            {/** unlike */}
                            <button className="btn btn-ghost" onClick={unlikePost}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#ef4444" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#ef4444" className="size-[1.2em]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </button>

                        </>

                    ) : (
                        // cas contraire -> like
                        <>
                            {/** like */}
                            <button className="btn btn-ghost" onClick={likePost}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                            </button>

                        </>
                    )}
                    {/** likes modal */}
                    <div className="dropdown dropdown-top dropdown-center">
                        <div tabIndex={0} role="button" className="btn btn-ghost m-1">{likeContent?.likes_count} likes️</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            {likeContent?.users && likeContent.likes_count > 0 ? (
                                <div>
                                    {likeContent.users.map((u: UserLiteProfile) => (
                                        <div key={u.id}>
                                            <li>
                                                <div className="max-w-full rounded-full ml-3 cursor-pointer" onClick={() => { navigate(`/profile/${u.username}`) }}>
                                                    <img
                                                        className="max-h-12 max-w-12 rounded-full"
                                                        alt="Tailwind CSS chat bubble component"
                                                        src={u.profile_picture ? ApiEndpoints.user.picture(u.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                                    />
                                                    <a>{u.username}</a>
                                                </div>

                                            </li>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 italic">Aucun like pour le moment</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/** comments logo & modal */}
                <div className="flex items-center gap-4">
                    <button className="btn btn-ghost flex" onClick={()=>
                        (document.getElementById('comment_modal') as HTMLDialogElement).showModal()}>{commentContent?.count}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                    <dialog id="comment_modal" className="modal">
                        <div className="modal-box" >
                            <h3 className="font-bold text-lg">Tous les commentaires</h3>
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">✕</button>
                                {/* display all comments */}
                                <>
                                    {commentContent?.comments && commentContent.count > 0 ? (
                                        <div className="max-h-96 overflow-y-auto mt-8">
                                            {commentContent?.comments.map((c: Comment) => (
                                                <div key={c.id} className="chat chat-start mb-4">
                                                    <div className="chat-image avatar">
                                                        <div className="w-10 rounded-full">
                                                            <img
                                                                alt="Tailwind CSS chat bubble component"
                                                                src={c.user.profile_picture ? ApiEndpoints.user.picture(c.user.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="flex-1">
                                                            <div className="chat-header">
                                                                {c.user.username}
                                                                <time className="text-xs opacity-50 ml-2">
                                                                    {pipeDate(c.created_at) || 'dd/MM/YYYY'}
                                                                </time>
                                                            </div>
                                                            <div className="chat-bubble break-all whitespace-pre-wrap">{c.content}</div>
                                                        </div>
                                                        <div className="self-center">
                                                            <CommentSettings comment={c} fetchComments={fetchComments} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-4 italic">Aucun commentaire pour le moment</p>
                                        )}
                                </>
                                {/* add comment */}
                                <div className="flex items-center border-t border-gray-800 p-3">
                                    <fieldset className="fieldset w-5/6">
                                        <legend className="fieldset-legend">Ecrire un commentaire : {valueInside.length} / 500</legend>
                                        <input
                                            type="text"
                                            id="commentInput"
                                            className="input input-md input-bordered w-full"
                                            placeholder="Partage des bonnes nouvelles"
                                            maxLength={500}
                                            onChange={handleChange}
                                        />
                                    </fieldset>
                                    <button
                                        className="btn btn-ghost mt-6"
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

                <div className="">
                    <button className="btn btn-ghost" onClick={() => console.log("partager")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

