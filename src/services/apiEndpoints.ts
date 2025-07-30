// Check if API server URL is properly defined
import axios from "axios";

export const API_BASE_URL: string = import.meta.env.DEV
    ? import.meta.env.VITE_API_SERVER_URL_DEV
    : import.meta.env.VITE_API_SERVER_URL_PROD;

const url = (path: string) => `${API_BASE_URL}${path}`

// setup axios pour le headers
export const AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

// récupère le token à chaque requete
AxiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
} );

export const ApiEndpoints = {
    follow: {
        getFollowers: (username: string) => url(`/follow/get-follow/${username}`),
        getFollowed: (username: string) => url(`/follow/get-followed/${username}`),
        follow: (username: string) => url(`/follow/${username}`),
        unfollow: (username: string) => url(`/follow/unfollow/${username}`),

    },
    post: {
        feed: (username: string) => url(`/post/feed/${username}`), // feed d'une personne
        edit: (postId: string) => url(`/post/edit/${postId}`),
        delete: (postId: string) => url(`/post/delete/${postId}`),
        feedGlobal: () => url('/post/feed/global'), // feed global (page explorer)
        feedPerso: () => url('/post/feed'), // feed personnalisé (page home)
        postObject: (postId: string) => url(`/post/${postId}`),
        postUpload: () => url('/post/upload'),
    },
    user: {
        profile: (username: string) => url(`/user/profile/${username}`),
        currentUserProfile: () => url('/user/profile'),
        edit: () => url('/user/edit'),
        search: (username: string) => url(`/user/search/${username}`),
        picture: (profilePicture: string) => url(`/user/picture/${profilePicture}`),
        defaultPicture: () => url('/user/picture/default.jpg'),
        uploadPicture: () => url('/user/upload-profile-picture'),
    },
    auth: {
        authToken: () => url('/auth/token'),
        login: () => url('/auth/login'),
        register: () => url('/auth/register'),
    },
    like: {
        likePost: (postId: string) => url(`/like/${postId}`),
        unlikePost: (postId: string) => url(`/like/${postId}/unlike`),
        getLikePost: (postId: string) => url(`/like/get-likes/${postId}`),
    },
};
