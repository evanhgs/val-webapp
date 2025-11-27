'use client';

import {useAlert} from "@/components/providers/AlertContext";
import {Post} from "@/types/Post";
import {useParams, useRouter} from "next/navigation";
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";
import FollowButton from "@/components/ui/FollowButton";
import {PostSettings} from "@/components/ui/PostSettings";
import {pipeDate} from "@/lib/pipe-dates";
import {PostActions} from "@/components/ui/PostActions";
import {useEffect, useState} from "react";

export default function PostPage(){

    const { showAlert } = useAlert();
    const [post, setPost] = useState<Post | null>(null);
    const { postId } = useParams<{ postId: string }>();
    const navigate = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
        if (!postId) return;
        const displayPostfromId = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await AxiosInstance.get(ApiEndpoints.post.getPost(Number(postId)));
                setPost(response.data.post);

            } catch (error) {
                setError(true);
                const err = error as { response?: { status: number } };
                if (err.response) {
                    const { status } = err.response;
                    switch (status) {
                        case 400:
                            showAlert('Le format de l\'id n\'est pas en UUID, veuillez réssayer avec un bon format', 'error');
                            break;
                        case 404:
                        case 422:
                            showAlert('Le post n\'a pas été trouvé', 'error');
                            break;
                        case 500:
                            showAlert('Une erreur serveur est survenue', 'error');
                            break;
                        default:
                            showAlert('Une erreur inattendue s\'est produite', 'error');
                    }
                }
            } finally {
                setLoading(false);
            }
        }

        displayPostfromId();
    }, [postId]);


    return (
        <div className="max-w-2xl mx-auto my-12 px-4">
            <div className="relative rounded-2xl overflow-hidden
                    bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900
                    border border-white/5
                    shadow-[0_0_40px_rgba(255,255,255,0.05)]">

                {/* Bouton retour */}
                <div className="p-4">
                    <button
                        onClick={() => navigate.back()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-zinc-800 text-white border border-white/5
                     hover:bg-zinc-700 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour
                    </button>
                </div>

                {/* États */}
                {loading ? (
                    <div className="p-12 text-center text-zinc-400">
                        Chargement du post...
                    </div>
                ) : error || !post ? (
                    <div className="p-12 text-center text-zinc-400">
                        Le post n'a pas été trouvé...
                    </div>
                ) : (
                    <div>

                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                            <img
                                src={post.user_profile
                                    ? ApiEndpoints.user.picture(post.user_profile)
                                    : ApiEndpoints.user.defaultPicture()}
                                alt={post?.username || 'Utilisateur'}
                                className="w-11 h-11 rounded-full object-cover border border-white/10"
                            />

                            <button
                                onClick={() => navigate.push(`/profile/${post.username}`)}
                                className="font-semibold text-white hover:underline text-sm"
                            >
                                {post?.username}
                            </button>

                            <div className="ml-auto flex items-center gap-3">
                                <FollowButton username={post.username} />
                                {post && <PostSettings post={post} />}
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative bg-zinc-950">
                            <img
                                src={post.image_url
                                    ? ApiEndpoints.user.picture(post.image_url)
                                    : ApiEndpoints.user.defaultPicture()}
                                alt="Post content"
                                className="w-full max-h-[600px] object-cover"
                            />
                        </div>

                        {/* Caption */}
                        {post?.caption && (
                            <div className="px-5 py-4 border-b border-white/5">
                                <p className="text-sm text-white">
                                    <span className="font-semibold mr-1">{post.username}:</span>
                                    <span>{post.caption}</span>
                                </p>
                                <p className="text-xs text-zinc-500 mt-2">
                                    Post publié le : {pipeDate(post?.created_at) || 'dd/mm/YYYY'}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="px-5 py-4">
                            <PostActions postId={post?.id} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}