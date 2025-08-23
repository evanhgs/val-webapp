import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FollowButton from '../components/FollowButton';
import { PostSettings } from "../components/PostSettings";
import { Post } from "../types/post";
import { useAlert } from '../components/AlertContext';
import { LikeButton } from '../components/LikeButton';
import {ApiEndpoints, AxiosInstance} from "../services/apiEndpoints.ts";
import {pipeDate} from "../components/PipeDate.ts";

// id du post en parametre GET sinon retourne 404 not found a faire
const ShowPost = () => {

    const { showAlert } = useAlert();
    const [post, setPost] = useState<Post | null>(null);
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
        if (!postId) return;
        const displayPostfromId = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await AxiosInstance.get(ApiEndpoints.post.postObject(postId));
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
        <div className="max-w-2xl mx-auto my-8 bg-black rounded-lg shadow-lg overflow-hidden">
            <div className="mb-4 pl-2">
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-white bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour
                </button>
            </div>
            {loading ? (
                <div className="p-8 text-center bg-gray-700">
                    <p className="text-gray-300">Chargement du post...</p>
                </div>
            ) : error || !post ? (
                <div className="p-8 text-center bg-gray-700">
                    <p className="text-gray-300">Le post n'a pas été trouvé...</p>
                </div>
            ): (
                <div className="post-container">

                    {/** header  */}
                    <div className="flex items-center p-4 border-b">
                        <img
                            src={post.user_profile ? ApiEndpoints.user.picture(post.user_profile) : ApiEndpoints.user.defaultPicture()}
                            alt={post?.username || 'Utilisateur'}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-3 cursor-pointer">
                            <button className="font-bold text-sm" onClick={() => { navigate(`/profile/${post.username}`) }}>{post?.username}</button>
                        </div>
                        <div className="ml-auto mr-4">
                            <FollowButton username={post.username}/>
                        </div>
                        {/* settings of your own post */}
                        {post && <PostSettings post={post} />}
                    </div>

                    <div className="post-image-container mt-10">
                        <img
                            src={post.image_url ? ApiEndpoints.user.picture(post.image_url) : ApiEndpoints.user.defaultPicture()}
                            alt="Post content"
                            className="w-full object-cover max-h-[600px] rounded-md"
                        />
                    </div>

                    {/* Post actions */}
                    <div className="p-4 border-b">
                        <div className="flex space-x-4 mb-2">

                            <LikeButton postId={post?.id} userId="" id="" createdAt=""/>

                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Post publié le : {pipeDate(post?.created_at) || 'dd/mm/YYYY'}
                        </p>
                    </div>

                    {/* Caption */}
                    {post?.caption && (
                        <div className="p-4">
                            <p className="text-sm">
                                <span className="font-bold mr-1">{post.username || '...'}: </span>
                                <span>{post.caption || '...'}</span>
                            </p>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}


export default ShowPost;
