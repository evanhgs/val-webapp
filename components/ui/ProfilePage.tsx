'use client';

import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {AuthContext} from "@/components/providers/AuthProvider";
import {useAlert} from "@/components/providers/AlertContext";
import {UserDTO} from "@/types/User";
import {FollowUser} from "@/types/Follow";
import {PostDetails} from "@/types/Post";
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";
import FollowButton from "@/components/ui/FollowButton";
import {FollowersModal} from "@/components/ui/FollowersModal";
import {NavPosts} from "@/components/ui/NavPosts";
import Footer from "@/components/ui/Footer";
import EditProfileForm from "@/components/forms/EditProfileForm";
import UploadButton from "@/components/forms/UploadProfilePictureForm";
import SendMessageButton from "@/components/ui/SendMessageButton";

interface ProfilePageProps {
    targetUsername?: string;
}

export default function ProfilePage({ targetUsername }: ProfilePageProps) {
    const { user } = useContext(AuthContext) || {};
    const token = user?.token;
    const router = useRouter();
    const { showAlert } = useAlert();

    const [userData, setUserData] = useState<UserDTO | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowed, setShowFollowed] = useState(false);

    const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [followed, setFollowed] = useState<FollowUser[]>([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [followedCount, setFollowedCount] = useState(0);
    const [post, setPost] = useState<PostDetails[]>([]);

    const isOwnProfile = !targetUsername || targetUsername === user?.username;
    const resolvedUsername = targetUsername || user?.username;

    // Récupération du profil
    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                showAlert('Vous devez être connecté pour vous suivre ce profil', 'info');
                return;
            }

            if (!resolvedUsername) {
                showAlert('Nom d’utilisateur introuvable', 'error');
                return;
            }

            try {
                const endpoint = isOwnProfile
                    ? ApiEndpoints.user.currentUserProfile()
                    : ApiEndpoints.user.profile(resolvedUsername);

                const response = await AxiosInstance.get(endpoint);

                setUserData({
                    id: response.data.id,
                    username: response.data.username,
                    email: response.data.email,
                    bio: response.data.bio || "",
                    website: response.data.website || "",
                    created_at: response.data.created_at,
                    profile_picture: response.data.profile_picture,
                });
            } catch (error) {
                showAlert(`Impossible de récupérer les informations du profil : ${error}`, 'error');
            }
        };

        fetchProfile();
    }, [token, resolvedUsername, isOwnProfile, router]);

    // Récupération des followers/followed/posts
    useEffect(() => {
        if (!token || !userData?.username) return;

        const fetchProfileData = async () => {
            try {
                setIsLoadingFollowers(true);

                const [followedResponse, followerResponse, postResponse] = await Promise.all([
                    AxiosInstance.get(ApiEndpoints.follow.getFollowed(userData.username)),
                    AxiosInstance.get(ApiEndpoints.follow.getFollowers(userData.username)),
                    AxiosInstance.get(ApiEndpoints.post.feed(userData.username))
                ]);

                setFollowed(followedResponse.data.followed || []);
                setFollowedCount(followedResponse.data.count || 0);
                setFollowers(followerResponse.data.followers || []);
                setFollowersCount(followerResponse.data.count || 0);

                const posts = (postResponse.data.content || []).map((item: {
                    post: PostDetails;
                    likes: number;
                    comments: number;
                }) => ({
                    ...item.post,
                    likes: item.likes,
                    comments: item.comments,
                }));
                setPost(posts);

            } catch (error) {
                showAlert(`Erreur lors de la récupération des données de l'utilisateur: ${error}`, 'error');
            } finally {
                setIsLoadingFollowers(false);
            }
        };

        fetchProfileData();
    }, [token, userData?.username]);

    if (!userData) {
        return (
            <div className="text-white text-center mt-10">
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-800 min-h-screen">
            {/* Formulaires modaux pour le profil personnel uniquement */}
            {isOwnProfile && isEditing ? (
                <EditProfileForm
                    userData={userData}
                    setIsEditing={setIsEditing}
                    onUpdateAlert={showAlert}
                />
            ) : isOwnProfile && isUploading ? (
                <UploadButton
                    userData={userData}
                    setIsUploading={setIsUploading}
                />
            ) : (
                <div className="max-w-3xl mx-auto md:p-20 p-4">
                    {/* Bouton retour */}
                    <div className="mb-4 pl-2">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center bg-zinc-900 hover:bg-zinc-500 hover:text-zinc-900 rounded-xl px-4 py-2 transition duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour
                        </button>
                    </div>

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-8 bg-zinc-900 rounded-xl p-4">
                        <div className="flex justify-center sm:justify-start mb-6 sm:mb-0">
                            <img
                                src={userData.profile_picture ? ApiEndpoints.user.picture(userData.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                alt="Profile"
                                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-zinc-400"
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                <h2 className="text-xl font-bold text-center sm:text-left mb-3 sm:mb-0">
                                    {userData.username}
                                </h2>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                    {isOwnProfile ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-3 py-1 text-sm rounded-xl bg-zinc-800 text-white border border-white/5
                                                            shadow-inner shadow-black/40 focus:outline-none focus:ring-2 focus:ring-white/10
                                                            transition cursor-pointer hover:bg-zinc-400 hover:text-zinc-900"
                                            >
                                                Modifier le profil
                                            </button>
                                            <button
                                                onClick={() => setIsUploading(true)}
                                                className="px-3 py-1 text-sm rounded-xl bg-zinc-800 text-white border border-white/5
                                                            shadow-inner shadow-black/40 focus:outline-none focus:ring-2 focus:ring-white/10
                                                            transition cursor-pointer hover:bg-zinc-400 hover:text-zinc-900"
                                            >
                                                Photo de profil
                                            </button>
                                            
                                        </>
                                    ) : (
                                        <>
                                            <FollowButton username={userData.username} />
                                            <SendMessageButton userId={userData.id} />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Statistiques */}
                            <div className="flex justify-center sm:justify-start space-x-6 mt-4 text-gray-300">
                                {isLoadingFollowers ? (
                                    <>
                                        <span><strong>...</strong> posts</span>
                                        <span><strong>...</strong> abonnés</span>
                                        <span><strong>...</strong> abonnements</span>
                                    </>
                                ) : (
                                    <>
                                        <span><strong>{post?.length ?? 0}</strong> posts</span>
                                        <span
                                            className="hover:text-white cursor-pointer transition-colors"
                                            onClick={() => setShowFollowers(true)}
                                        >
                      <strong>{followersCount}</strong> abonnés
                    </span>
                                        <span
                                            className="hover:text-white cursor-pointer transition-colors"
                                            onClick={() => setShowFollowed(true)}
                                        >
                      <strong>{followedCount}</strong> abonnements
                    </span>
                                    </>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="mt-4 text-center sm:text-left">
                                <p>{userData.bio}</p>
                                {userData.website && (
                                    <p className="text-sm mt-2 text-blue-400 hover:text-blue-300 transition-colors">
                                        {userData.website}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Highlights */}
                    {isOwnProfile && (
                        <div className="mt-8 flex justify-center sm:justify-start space-x-6 overflow-x-auto pb-2">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 border-2 border-gray-600 flex items-center justify-center rounded-full hover:border-gray-500 transition-colors cursor-pointer">
                                    <span className="text-2xl">➕</span>
                                </div>
                                <p className="text-sm mt-2">Nouveau</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation posts */}
                    <div className="border-t border-gray-700 mt-8 flex justify-center space-x-2 sm:space-x-10 py-2 overflow-x-auto">
                        <span className="text-white font-bold p-2 hover:border hover:border-white rounded-lg cursor-pointer whitespace-nowrap transition-all">
                          📷 POSTS
                        </span>
                                    {isOwnProfile && (
                                        <span className="text-gray-500 p-2 hover:border hover:border-white hover:text-white rounded-lg cursor-pointer whitespace-nowrap transition-all">
                            🔖 SAUVEGARDÉS
                          </span>
                                    )}
                                    <span className="text-gray-500 p-2 hover:border hover:border-white hover:text-white rounded-lg cursor-pointer whitespace-nowrap transition-all">
                          🏷️ IDENTIFIÉ
                        </span>
                    </div>

                    <NavPosts post={post} />
                </div>
            )}

            {/* Modales */}
            {showFollowers && (
                <FollowersModal
                    users={followers}
                    title="Abonnés"
                    onClose={() => setShowFollowers(false)}
                />
            )}
            {showFollowed && (
                <FollowersModal
                    users={followed}
                    title="Abonnements"
                    onClose={() => setShowFollowed(false)}
                />
            )}
            <div className="flex flex-col items-center">
                <Footer />
            </div>
        </div>
    );
}
