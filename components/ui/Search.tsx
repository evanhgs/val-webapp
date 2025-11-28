'use client';

import {useState} from "react";
import {FollowUser} from "@/types/Follow";
import axios from "axios";
import {ApiEndpoints} from "@/lib/endpoints";
import OutsideClick from "@/components/ui/OutsideClick";
import {SearchProps} from "@/types/searchProps";
import {FollowersModal} from "@/components/ui/FollowersModal";


export default function Search({ setIsSearch, isCompact }: SearchProps) {
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState<{ users: FollowUser[] }>({
        users: []
    });

    const handleSubmit = async () => {
        if (!input?.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.get(ApiEndpoints.user.search(input));
            setSearchResult({
                users: response.data.users.length > 0
                    ? response.data.users
                    : []
            });
            setShowSearchResult(true);
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            setSearchResult({
                users: []
            });
            setShowSearchResult(true);
        } finally {
            setIsLoading(false);
        }
    };



    const searchContainerRef = OutsideClick(() => {
        setIsSearch(false);
    });

    return (
        <div className="fixed inset-0 z-40 bg-zinc-900/80 backdrop-blur-sm">
            <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-50`}
                ref={searchContainerRef}
            >
                <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-2xl shadow-[0_8px_32px_rgba(255,255,255,0.06)] border border-white/5 ${isCompact ? 'w-[250px]' : 'w-[350px]'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">Recherche</h3>
                        <button
                            onClick={() => setIsSearch(false)}
                            className="text-zinc-400 hover:text-white transition-colors duration-200 hover:scale-110 active:scale-95"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-3 ps-4 text-sm text-white border border-white/5 rounded-xl bg-zinc-800 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all duration-200 placeholder:text-zinc-500"
                            placeholder="Chercher un pseudo"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                        />
                        <button
                            type="submit"
                            className={`absolute right-2 bottom-2 bg-white text-zinc-900 text-sm font-medium rounded-lg px-4 py-1.5 transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? '...' : 'Chercher'}
                        </button>
                    </div>

                    {input.trim() && (
                        <div className="mt-3 text-xs text-zinc-400">
                            Recherche pour: "<span className="text-white/70">{input}</span>"
                        </div>
                    )}
                </div>

                {showSearchResult && (
                    <FollowersModal
                        users={searchResult.users}
                        title="Résultat(s)"
                        onClose={() => {
                            setShowSearchResult(false);
                            setIsSearch(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};
