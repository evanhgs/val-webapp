'use client';

import React, {useEffect, useState} from 'react';
import Footer from "@/components/ui/Footer";
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";
import {UserLightDTO} from "@/types/User";
import {useAlert} from "@/components/providers/AlertContext";
import {useRouter} from "next/navigation";

export const Suggestions: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [userSuggested, setUserSuggested] = useState<UserLightDTO[] | undefined>(undefined);
    const {showAlert} = useAlert();
    const router = useRouter();

    useEffect(() => {
        const fetchSuggestion = async () => {
            try {
                setLoading(true);
                const response = await AxiosInstance.get(ApiEndpoints.user.suggestions());
                setUserSuggested(response.data.user);
            } catch (error) {
                showAlert('Une erreur est survenue pour les suggestions', 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchSuggestion();
    }, []);

    return (
        <div className="bg-zinc-600 rounded-lg p-4 relative">
            <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 text-zinc-300">Suggestions pour vous</h2>
                {loading ? (
                    <div className="flex w-52 flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-4">
                                <div className="skeleton h-4 w-20"></div>
                                <div className="skeleton h-4 w-28"></div>
                            </div>
                        </div>
                        <div className="skeleton h-32 w-full"></div>
                    </div>
                ) : userSuggested && userSuggested.length > 0 ? (
                    userSuggested.map((user: UserLightDTO) => (
                        <div key={user.id} className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <img
                                    src={user.profile_picture ? ApiEndpoints.user.picture(user.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-700"
                                />

                                <div className="ml-3">
                                    <button className="font-bold text-sm cursor-pointer" onClick={() => { router.push(`/profile/${user.username}`) }}>{user?.username}</button>
                                    <p className="text-xs text-gray-400">Suggestions pour vous</p>
                                </div>
                            </div>
                            <button className="text-blue-500 text-xs font-semibold hover:text-blue-400">
                                Suivre
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex w-52 flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-4">
                                <div className="skeleton h-4 w-20"></div>
                                <div className="skeleton h-4 w-28"></div>
                            </div>
                        </div>
                        <div className="skeleton h-32 w-full"></div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};