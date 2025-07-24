// Check if API server URL is properly defined
import axios from "axios";
import config from '../config';


if (import.meta.env.DEV && !import.meta.env.VITE_API_SERVER_URL) {
    console.error("Warning: VITE_API_SERVER_URL is not defined in your environment variables!");
}

export const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || ''; // crash 

const url = (path: string) => `${API_BASE_URL}${path}`

// setup axios pour envoyer des requetes
export const AxiosInstance = axios.create({
    baseURL: config.serverUrl,
    headers: {
        'Content-Type': 'application/json',
        ...({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` })
    }
});

export const ApiEndpoints = {
    follow: {
        getFollowers: (username: string) => url(`/follow/get-follow/${username}`),
        getFollowed: (username: string) => url(`/follow/get-followed/${username}`),
        follow: (username: string) => url(`/follow/${username}`),
        unfollow: (username: string) => url(`/follow/unfollow/${username}`),

    },
    post: {
        feed: (username: string) => url(`/post/feed/${username}`),
    },
    user: {
        profile: (username: string) => url(`/user/profile/${username}`),
        edit: () => url('/user/edit'),
        search: (username: string) => url(`/user/search/${username}`),
        picture: (profilePicture: string) => url(`/user/picture/${profilePicture}`),
        defaultPicture: () => url('/user/picture/default.jpg'),
    },
    auth: {
      authToken: () => url('/auth/token'),
    },
    like: {
        likePost: (postId: string) => url(`/like/${postId}`),
        unlikePost: (postId: string) => url(`/like/${postId}/unlike`),
        getLikePost: (postId: string) => url(`/like/get-likes/${postId}`),
    },
};
