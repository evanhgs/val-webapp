// Check if API server URL is properly defined
if (import.meta.env.DEV && !import.meta.env.VITE_API_SERVER_URL) {
    console.error("Warning: VITE_API_SERVER_URL is not defined in your environment variables!");
}

export const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || ''; // crash 

const url = (path: string) => `${API_BASE_URL}${path}`

export const ApiEndpoints = {
    follow: {
        getFollowers: (username: string) => url(`/follow/get-follow/${username}`),
        getFollowed: (username: string) => url(`/follow/get-followed/${username}`),
    },
    post: {
        feed: (username: string) => url(`/post/feed/${username}`),
    },
    user: {
        profile: (username: string) => url(`/user/profile/${username}`),
        edit: () => url('/user/edit'),
    },
};