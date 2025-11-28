'use client';

import React, {useEffect, useRef, useState} from "react";
import {StoriesProps, UserStories} from "@/types/StoriesProps";
import {useRouter} from "next/navigation";
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";

export const Stories: React.FC<StoriesProps> = ({ username, profile_picture }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useRouter();
    const foreignProfile = (username: string): void => {
        navigate.push(`/profile/${username}`);
    };

    // tableau contenant en premier élément le nombre d'abonnement, les personnes suivies
    const [userStories, setUserStories] = useState<UserStories>({
        count_user: null,
        followed_users: []
    });

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            const scrollPosition = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    };

    // hook qui fetch la requete pour afficher tous les users que suit notre main
    useEffect(() => {
        const getFollower = async () => {
            if (!username) return;

            try {
                const response = await AxiosInstance.get(ApiEndpoints.follow.getFollowed(username));
                setUserStories({
                    count_user: response.data.count,
                    followed_users: response.data.followed,
                });
            } catch (error) {
                console.error("Error fetching followers:", error);
            }
        };
        getFollower();
    }, [username]); // ajoute username comme dépendance

    return (
        <div className="relative rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 md:p-5 border border-white/5 shadow-[0_8px_32px_rgba(255,255,255,0.04)]">

            {/* Bouton gauche */}
            {userStories.followed_users && userStories.followed_users.length > 0 && (
                <button
                    onClick={() => handleScroll('left')}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-zinc-700 hover:bg-zinc-600 rounded-full p-2 text-white shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 z-10 border border-white/10"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            )}

            {/* Container avec défilement horizontal */}
            <div
                ref={scrollContainerRef}
                className="flex space-x-5 py-2 px-2 overflow-x-auto scrollbar-hide"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    scrollSnapType: 'x mandatory',
                }}
            >
                {/* Profil de l'utilisateur connecté */}
                {username && (
                    <div className="flex flex-col items-center flex-shrink-0 scroll-snap-align-start group transition-all duration-200" style={{ width: '76px', minWidth: '76px' }}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <div className="relative bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 rounded-full p-0.5 shadow-[0_4px_16px_rgba(236,72,153,0.3)]">
                                <div className="bg-zinc-900 rounded-full p-0.5">
                                    <img
                                        src={profile_picture ? ApiEndpoints.user.picture(profile_picture) : ApiEndpoints.user.defaultPicture()}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                        <span
                            className="text-xs mt-2 text-white/90 truncate w-full text-center cursor-pointer hover:text-white transition-colors duration-200 font-medium"
                            onClick={() => navigate.push("/profile")}
                        >
                        {username}
                    </span>
                    </div>
                )}

                {/* Profiles des abonnements */}
                {userStories.followed_users?.map((user, index) => (
                    <div key={index} className="flex flex-col items-center flex-shrink-0 scroll-snap-align-start group transition-all duration-200" style={{ width: '76px', minWidth: '76px' }}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <div className="relative bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 rounded-full p-0.5 shadow-[0_4px_16px_rgba(236,72,153,0.3)]">
                                <div className="bg-zinc-900 rounded-full p-0.5">
                                    <img
                                        src={user.profile_picture ? ApiEndpoints.user.picture(user.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                        <span
                            className="text-xs mt-2 text-white/90 truncate w-full text-center cursor-pointer hover:text-white transition-colors duration-200 font-medium"
                            onClick={() => foreignProfile(user.username)}
                        >
                        {user.username}
                    </span>
                    </div>
                ))}
            </div>

            {/* Bouton droite */}
            {userStories.followed_users && userStories.followed_users.length > 0 && (
                <button
                    onClick={() => handleScroll('right')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-zinc-700 hover:bg-zinc-600 rounded-full p-2 text-white shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 z-10 border border-white/10"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            )}
        </div>
    );
};
