import axios from 'axios';
import config from '../config';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface Post { // meme objet post que dans profile 
    caption: string;
    created_at: string;
    image_url: string;
    user_profile: string;
    username: string;
    id: string;
  }

// id du post en parametre GET sinon retourne 404 not found
const ShowPost = () => {

    const [post, setPost] = useState<Post[]>([]);

    //const PostId = useState('383cf999-2d11-4549-8653-ee2bbbba8faf');

    const {id} = useParams<{ id: string}>();

    const displayPostfromId = async () => {
        const response = await axios.get(
            `${config.serverUrl}/post/${id}`,
        );

        setPost(response.data.post || []);
    }
    displayPostfromId();
    return(
            <div className="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-lg overflow-hidden">
                {post.length > 0 ? (
                    <div className="post-container">
                        {/* Header with user info */}
                        <div className="flex items-center p-4 border-b">
                            <img 
                                src={post[0].user_profile || 'https://via.placeholder.com/40'} 
                                alt={post[0].username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-3">
                                <p className="font-bold text-sm">{post[0].username}</p>
                            </div>
                        </div>
                        
                        {/* Image */}
                        <div className="post-image-container">
                            <img 
                                src={post[0].image_url} 
                                alt="Post content" 
                                className="w-full object-cover max-h-[600px]"
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
                        </div>
                        
                        {/* Caption */}
                        <div className="p-4">
                            <p className="text-sm">
                                <span className="font-bold mr-1">{post[0].username}</span>
                                {post[0].caption}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                {new Date(post[0].created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">Loading post...</p>
                    </div>
                )}
            </div>
    );
}

export default ShowPost;