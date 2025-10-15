// Check if API server URL is properly defined
import axios from "axios";

export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "";
export const FRONTEND_URL: string = process.env.NEXT_PUBLIC_FRONT_URL ?? "";
export const API_MQTT_WSS: string = process.env.NEXT_PUBLIC_API_MQTT_WSS ?? "";
export const API_MQTT_USER: string = process.env.NEXT_PUBLIC_API_MQTT_USER ?? "";
export const API_MQTT_PASSWORD: string = process.env.NEXT_PUBLIC_API_MQTT_PASSWORD ?? "";
export const REACT_APP_GIT_VERSION: string = process.env.NEXT_PUBLIC_REACT_APP_GIT_VERSION ?? "";

// console.log(API_BASE_URL)

const url = (path: string) => `${API_BASE_URL}${path}`

// setup axios pour le headers
export const AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

export const AxiosInstanceFormData = axios.create({
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})

// récupère le token à chaque requete
AxiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
} );

AxiosInstanceFormData.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
} );

export const Config = {
    follow: {
        getFollowers: (username: string) => url(`/follow/get-follow/${username}`),
        getFollowed: (username: string) => url(`/follow/get-followed/${username}`),
        follow: (username: string) => url(`/follow/${username}`),
        unfollow: (username: string) => url(`/follow/unfollow/${username}`),

    },
    post: {
        feed: (username: string) => url(`/post/feed/${username}`), // feed d'une personne
        edit: (postId: number) => url(`/post/edit/${postId}`),
        delete: (postId: number) => url(`/post/delete/${postId}`),
        feedGlobal: () => url('/post/feed/global'), // feed global (page explorer)
        feedPerso: () => url('/post/feed'), // feed personnalisé (page home)
        getPost: (postId: number) => url(`/post/${postId}`),
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
        likePost: (postId: number) => url(`/like/${postId}`),
        unlikePost: (postId: number) => url(`/like/${postId}`),
        getLikedPostsByUser: (userId: number) => url(`/like/liked-posts/${userId}`), // display all posts liked by a user
        getPostLikes: (postId: number) => url(`/like/get-likes/${postId}`),
    },
    comment: {
        addComment: (postId: number) => url(`/comment/${postId}`),
        deleteComment: (commentId: number) => url(`/comment/${commentId}`),
        getComments: (postId: number) => url(`/comment/${postId}`),
        getCurrentAll: () => url('/comment/current/all'), // get all comments of current user
        editComment: (commentId: number) => url(`/comment/${commentId}`),
    },
    message: {
        sendMessage: (userId: number) => url (`/message/send/${userId}`), // post method
        deleteMessage: (messageId: number) => url(`/message/${messageId}`),
        editMessage: (messageId: number) => url(`/message/${messageId}`), // patch method to edit the content of msg
        getConversationContent: (conversationId: number) => url(`/message/conversation/${conversationId}/content`), // get msg in the conv between 2 users
        getAllConversation: () => url('/message/messages'), // display all messages of current user
    },
    version: {
        getVersion: () => url('/version'),
    }
};
