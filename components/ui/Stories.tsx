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
        <div className="relative rounded-lg bg-gray-900 p-2 md:p-4">
            {/* Bouton gauche - visible seulement si nécessaire (il est toujours nécessaire)*/}
            {userStories.followed_users && userStories.followed_users.length > 0 && (
                <button
                    onClick={() => handleScroll('left')}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full p-1.5 text-white shadow-lg opacity-80 hover:opacity-100 z-10"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            )}

            {/* Container avec défilement horizontal */}
            <div
                ref={scrollContainerRef}
                className="flex space-x-4 py-1 px-2 overflow-x-auto scrollbar-hide"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    scrollSnapType: 'x mandatory',
                }}
            >
                {/* profil de l'utilisateur connecté */}
                {username && (
                    <div className="flex flex-col items-center flex-shrink-0 scroll-snap-align-start" style={{ width: '72px', minWidth: '72px' }}>
                        <div className="ring-2 ring-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full p-0.5">
                            <img
                                src={profile_picture ? ApiEndpoints.user.picture(profile_picture) : ApiEndpoints.user.defaultPicture()}
                                alt="Profile"
                                className="w-14 h-14 rounded-full object-cover border-2 border-black"
                            />
                        </div>
                        <span
                            className="text-xs mt-1 text-white truncate w-full text-center cursor-pointer"
                            onClick={() => navigate.push("/profile")}
                        >
              {username}
            </span>
                    </div>
                )}

                {/* profiles des abonnements */}
                {userStories.followed_users?.map((user, index) => (
                    <div key={index} className="flex flex-col items-center flex-shrink-0 scroll-snap-align-start" style={{ width: '72px', minWidth: '72px' }}>
                        <div className="ring-2 ring-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full p-0.5">
                            <img
                                src={user.profile_picture ? ApiEndpoints.user.picture(user.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                alt="Profile"
                                className="w-14 h-14 rounded-full object-cover border-2 border-black"
                            />
                        </div>
                        <span
                            className="text-xs mt-1 text-white truncate w-full text-center cursor-pointer"
                            onClick={() => foreignProfile(user.username)}
                        >
              {user.username}
            </span>
                    </div>
                ))}
            </div>

            {/* Bouton droite*/}
            {userStories.followed_users && userStories.followed_users.length > 0 && (
                <button
                    onClick={() => handleScroll('right')}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full p-1.5 text-white shadow-lg opacity-80 hover:opacity-100 z-10"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            )}
        </div>
    );
};
