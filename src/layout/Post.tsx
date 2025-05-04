import axios from 'axios';
import config from '../config';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FollowButton from '../components/FollowButton';
import { PostSettings } from "../components/PostSettings";

interface Post { 
    caption: string;
    created_at: string;
    id: string;
    image_url: string;
    user_profile_url: string;
    username: string;
  }


// id du post en parametre GET sinon retourne 404 not found a faire
const ShowPost = () => {

    const [post, setPost] = useState<Post | null>(null); 
    const {id} = useParams<{ id: string}>();
    const navigate = useNavigate();


    useEffect(() => {
        const displayPostfromId = async () => {
            try {
                const response = await axios.get(
                    `${config.serverUrl}/post/${id}`
                );                
                setPost(response.data.post);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        }
        displayPostfromId().then(r => console.log(r));
    }, [id]);

    
    return(
        <div className="max-w-2xl mx-auto my-8 bg-black rounded-lg shadow-lg overflow-hidden">
            <div className="mb-4 pl-2">
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-white bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
                </button>
            </div>
            {post ? ( 
                <div className="post-container">
                    
                    {/** header  */}
                    <div className="flex items-center p-4 border-b">
                        <img 
                            src={`${config.serverUrl}/user/profile-picture/${post.user_profile_url}` || `${config.serverUrl}/user/profile-picture/default.jpg`}
                            alt={post?.username || 'Utilisateur'}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-3 cursor-pointer">
                            <button className="font-bold text-sm" onClick={() => {navigate(`/profile/${post.username}`)}}>{post?.username}</button>
                        </div>
                        <div className="ml-auto mr-4">
                            <FollowButton user={{username: post.username}} />
                        </div>
                        {/* settings of your own post */}
                        <PostSettings postOwner={post?.username}/>

                    </div>
                    
                    <div className="post-image-container mt-10">
                        <img 
                            src={`${config.serverUrl}/user/profile-picture/${post.image_url}` || `${config.serverUrl}/user/profile-picture/default.jpg`} 
                            alt="Post content" 
                            className="w-full object-cover max-h-[600px] rounded-md"
                        />
                    </div>
                    
                    {/* Post actions */}
                    <div className="p-4 border-b">
                        <div className="flex space-x-4 mb-2">
                            <button className="focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                            <button className="focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </button>
                            <button className="focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            {post?.created_at.substring(0,10) || 'YYYY/mm/dd'}
                        </p>
                    </div>
                    
                    {/* Caption */}
                    { post?.caption && (
                        <div className="p-4">
                        <p className="text-sm">
                            <span className="font-bold mr-1">{post.username || '...'}: </span>
                            <span>{post.caption || '...'}</span>
                        </p>
                    </div>
                    )}
                    
                </div>
            ) : (
                <div className="p-8 text-center bg-gray-700">
                    <p className="text-gray-300">Loading post...</p>
                </div>
            )}
        </div>
    );
}

export default ShowPost;