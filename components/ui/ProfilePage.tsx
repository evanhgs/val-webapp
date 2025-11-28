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
                showAlert('Nom d\'utilisateur introuvable', 'error');
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
            <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <p className="text-white/70 text-sm">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800">
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
                <div className="max-w-4xl mx-auto md:p-20 p-4">
                    {/* Bouton retour */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl px-4 py-2.5 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.1)] font-medium text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour
                        </button>
                    </div>

                    {/* Header */}
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-[0_8px_32px_rgba(255,255,255,0.06)] border border-white/5 p-6 mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-8">
                            <div className="flex justify-center sm:justify-start mb-6 sm:mb-0">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-200"></div>
                                    <div className="relative bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-full p-0.5 shadow-[0_4px_16px_rgba(236,72,153,0.3)]">
                                        <div className="bg-zinc-900 rounded-full p-1">
                                            <img
                                                src={userData.profile_picture ? ApiEndpoints.user.picture(userData.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                                alt="Profile"
                                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
                                    <h2 className="text-2xl font-bold text-white text-center sm:text-left mb-3 sm:mb-0">
                                        {userData.username}
                                    </h2>

                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                        {isOwnProfile ? (
                                            <>
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-4 py-2 text-sm rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white border border-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(255,255,255,0.1)] transition-all duration-200 hover:scale-105 active:scale-95 font-medium"
                                                >
                                                    Modifier le profil
                                                </button>
                                                <button
                                                    onClick={() => setIsUploading(true)}
                                                    className="px-4 py-2 text-sm rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white border border-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(255,255,255,0.1)] transition-all duration-200 hover:scale-105 active:scale-95 font-medium"
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
                                <div className="flex justify-center sm:justify-start space-x-8 mb-5 text-zinc-300">
                                    {isLoadingFollowers ? (
                                        <>
                                            <span className="text-sm"><strong className="text-white">...</strong> posts</span>
                                            <span className="text-sm"><strong className="text-white">...</strong> abonnés</span>
                                            <span className="text-sm"><strong className="text-white">...</strong> abonnements</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-sm">
                                                <strong className="text-white text-base">{post?.length ?? 0}</strong> posts
                                            </span>
                                            <button
                                                className="text-sm hover:text-white transition-colors duration-200"
                                                onClick={() => setShowFollowers(true)}
                                            >
                                                <strong className="text-white text-base">{followersCount}</strong> abonnés
                                            </button>
                                            <button
                                                className="text-sm hover:text-white transition-colors duration-200"
                                                onClick={() => setShowFollowed(true)}
                                            >
                                                <strong className="text-white text-base">{followedCount}</strong> abonnements
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Bio */}
                                <div className="text-center sm:text-left">
                                    <p className="text-white/90 text-sm leading-relaxed">{userData.bio}</p>
                                    {userData.website && (
                                        <a
                                            href={userData.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block text-sm mt-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                                        >
                                            {userData.website}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Highlights //TODO Features
                    {isOwnProfile && (
                        <div className="mb-8 flex justify-center sm:justify-start space-x-6 overflow-x-auto pb-2">
                            <div className="flex flex-col items-center group cursor-pointer">
                                <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-white/10 flex items-center justify-center rounded-full hover:border-white/30 transition-all duration-200 hover:scale-105 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                                    <span className="text-3xl group-hover:scale-110 transition-transform duration-200">➕</span>
                                </div>
                                <p className="text-sm mt-2 text-zinc-400 group-hover:text-white transition-colors duration-200">Nouveau</p>
                            </div>
                        </div>
                    )}
                     */}

                    {/* Navigation posts */}
                    <div className="border-t border-white/5 mb-6 flex justify-center space-x-4 sm:space-x-12 py-3 overflow-x-auto">
                        <button className="text-white font-semibold px-4 py-2 border-b-2 border-white rounded-t-lg whitespace-nowrap transition-all duration-200 text-sm flex items-center gap-2">
                            <span>📷</span> POSTS
                        </button>
                        {isOwnProfile && (
                            <button className="text-zinc-400 hover:text-white font-medium px-4 py-2 hover:bg-zinc-800/50 rounded-lg whitespace-nowrap transition-all duration-200 text-sm flex items-center gap-2">
                                <span>🔖</span> SAUVEGARDÉS
                            </button>
                        )}
                        <button className="text-zinc-400 hover:text-white font-medium px-4 py-2 hover:bg-zinc-800/50 rounded-lg whitespace-nowrap transition-all duration-200 text-sm flex items-center gap-2">
                            <span>🏷️</span> IDENTIFIÉ
                        </button>
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

            <div className="flex flex-col items-center pt-12 pb-8">
                <Footer />
            </div>
        </div>
    );
}