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
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-[0_8px_32px_rgba(255,255,255,0.04)] border border-white/5 overflow-hidden">
            <div className="p-5">
                <h2 className="text-base font-semibold mb-5 text-white">Suggestions pour vous</h2>

                {loading ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-zinc-800 animate-pulse shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"></div>
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="h-3 w-24 rounded-lg bg-zinc-800 animate-pulse shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"></div>
                                <div className="h-2 w-32 rounded-lg bg-zinc-800 animate-pulse shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"></div>
                            </div>
                        </div>
                        <div className="h-24 w-full rounded-xl bg-zinc-800 animate-pulse shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"></div>
                    </div>
                ) : userSuggested && userSuggested.length > 0 ? (
                    <div className="space-y-4">
                        {userSuggested.map((user: UserLightDTO) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between group transition-all duration-200"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={user.profile_picture ? ApiEndpoints.user.picture(user.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                            alt="Profile"
                                            className="w-11 h-11 rounded-full object-cover border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-200 group-hover:border-white/20"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <button
                                            className="font-medium text-sm text-white cursor-pointer hover:text-white/80 transition-colors duration-200 truncate block w-full text-left"
                                            onClick={() => { router.push(`/profile/${user.username}`) }}
                                        >
                                            {user?.username}
                                        </button>
                                        <p className="text-xs text-zinc-400 truncate">Suggéré pour vous</p>
                                    </div>
                                </div>

                                <button className="ml-2 text-white text-xs font-medium bg-zinc-700 hover:bg-zinc-600 px-4 py-1.5 rounded-lg transition-all duration-200 hover:shadow-[0_0_16px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 flex-shrink-0">
                                    Suivre
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-zinc-800 animate-pulse shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"></div>
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="h-3 w-24 rounded-lg bg-zinc-800 animate-pulse shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"></div>
                                <div className="h-2 w-32 rounded-lg bg-zinc-800 animate-pulse shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"></div>
                            </div>
                        </div>
                        <div className="h-24 w-full rounded-xl bg-zinc-800 animate-pulse shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"></div>
                    </div>
                )}
            </div>

            <div className="border-t border-white/5 bg-zinc-900/50 backdrop-blur-sm">
                <Footer />
            </div>
        </div>
    );
};