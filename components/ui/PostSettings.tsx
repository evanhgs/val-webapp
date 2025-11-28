'use client';

import {Post} from "@/types/Post";
import {AuthContext} from "@/components/providers/AuthProvider";
import React, {useContext, useEffect, useState} from "react";
import {useAlert} from "@/components/providers/AlertContext";
import {useRouter} from "next/navigation";
import OutsideClick from "@/components/ui/OutsideClick";
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";
import clsx from "clsx";

export const PostSettings = ({ post }: { post: Post }) => {

    const { user } = useContext(AuthContext) || {};
    const { showAlert } = useAlert();
    const navigate = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditFormPostOpen, setIsEditFormPostOpen] = useState(false);
    const [formData, setFormData] = useState({
        caption: "",
        hidden_tag: false,
    });
    useEffect(() => {
        if (post) {
            setFormData({
                caption: post?.caption || "",
                hidden_tag: Boolean(post?.hidden_tag)
            });
        }
    }, [post]);

    const leaveContainerRef = OutsideClick(() => {
        setIsEditFormPostOpen(false);
    });
    const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleEditCaption = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AxiosInstance.post(ApiEndpoints.post.edit(post.id), formData);
            setIsEditFormPostOpen(false);
            showAlert('Post modifié avec succès', 'success');

        } catch (error) {
            const err = error as { response?: { data?: { error?: string }; status?: number } };
            if (err.response) {
                const { data, status } = err.response;

                switch (status) {
                    case 400:
                        if (data?.error && data?.error.includes('caption is too long')) {
                            showAlert('La légende est trop longue (max 200 caractères)', 'error');
                        } else {
                            showAlert('Format de post invalide', 'error');
                        }
                        break;
                    case 401:
                        showAlert('Vous devez être connecté pour modifier ce post', 'error');
                        break;
                    case 403:
                        showAlert('Vous n\'êtes pas autorisé à modifier ce post', 'error');
                        break;
                    case 404:
                        showAlert('Post introuvable', 'error');
                        break;
                    case 500:
                        showAlert('Une erreur serveur est survenue', 'error');
                        break;
                    case 204:
                        showAlert('Aucune modification détectée', 'info');
                        setIsEditFormPostOpen(false);
                        break;
                    default:
                        showAlert('Une erreur inattendue s\'est produite', 'error');
                }
            }
        }
    }

    const handleDeletePost = async () => {
        try {
            await AxiosInstance.delete(ApiEndpoints.post.delete(post.id));
            showAlert('Post supprimé avec succès', 'success');
            navigate.push("/profile");

        } catch (error) {
            const err = error as { response?: { status: number } };
            if (err.response) {
                const { status } = err.response;
                switch (status) {
                    case 401:
                        showAlert('Vous devez être connecté pour supprimer ce post', 'error');
                        break;
                    case 403:
                        showAlert('Vous n\'êtes pas authorisé à supprimer ce post', 'error');
                        break;
                    case 404:
                        showAlert('Le post n\'a pas été trouvé', 'error');
                        break;
                    case 500:
                        showAlert('Une erreur serveur est survenue', 'error');
                        break;
                    default:
                        showAlert('Une erreur inattendue s\'est produite', 'error');
                }
            }
        }
    }

    const toggleHiddenTag = () => {
        setFormData(prevData => {
            const newValue = !prevData.hidden_tag;
            return {
                ...prevData,
                hidden_tag: newValue
            };
        });
    };

    function SwitchBtn({ isOn, onChange }: { isOn: boolean, onChange: () => void }) {
        return (
            <div className="mb-6 flex items-center justify-between p-4 bg-zinc-800/50 border border-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                        <div className="text-sm font-medium">Masquer le post</div>
                        <div className="text-xs text-zinc-500">Le post n'apparaîtra plus dans le fil</div>
                    </div>
                </div>
                <label className="flex items-center cursor-pointer">
                    <div
                        onClick={onChange}
                        className={clsx(
                            "cursor-pointer w-14 h-7 flex items-center rounded-full px-1 transition-all duration-300 shadow-inner",
                            isOn
                                ? "bg-emerald-500 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"
                                : "bg-zinc-700 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]"
                        )}>
                        <div className={clsx(
                            "w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-lg",
                            isOn ? "translate-x-7" : "translate-x-0"
                        )} />
                    </div>
                </label>
            </div>
        )
    }

    const editFormPost = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20 p-4">
                <div className="bg-zinc-900 border border-white/5 rounded-2xl shadow-[0_20px_60px_rgba(255,255,255,0.1)] p-8 w-full max-w-xl"
                     ref={leaveContainerRef}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Modifier le post</h3>
                        <button
                            onClick={() => setIsEditFormPostOpen(false)}
                            className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full p-2 transition-all duration-300 active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleEditCaption} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-3 text-zinc-400">Légende du post</label>
                            <textarea
                                className="w-full bg-zinc-800 border border-white/5 rounded-xl p-4 text-white placeholder:text-zinc-500 focus:border-white/20 focus:ring-2 focus:ring-white/10 shadow-inner transition-all duration-300 resize-none"
                                rows={5}
                                name="caption"
                                value={formData.caption}
                                onChange={handleEditChange}
                                placeholder={post?.caption || "Ajoutez une légende..."}
                            />
                            <div className="text-xs text-zinc-500 mt-2 text-right">{formData.caption.length} / 200 caractères</div>
                        </div>

                        <SwitchBtn isOn={formData.hidden_tag} onChange={toggleHiddenTag} />

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsEditFormPostOpen(false)}
                                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-xl font-medium transition-all duration-300 active:scale-95 shadow-sm">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-white text-zinc-900 hover:bg-white/90 rounded-xl font-semibold shadow-[0_4px_16px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (isEditFormPostOpen == true) {
        return editFormPost()
    }

    if (post?.username === user?.username) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-white/5 rounded-full transition-all duration-300 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-12 bg-zinc-900 border border-white/5 rounded-xl shadow-[0_12px_40px_rgba(255,255,255,0.1)] p-3 z-20 w-48 backdrop-blur-sm">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-2">
                            <span className="text-sm font-semibold">Options</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-300"
                            >
                                ×
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setIsEditFormPostOpen(true);
                            }}
                            className="w-full text-left p-3 text-sm hover:bg-white/5 rounded-lg flex items-center gap-3 transition-all duration-300 active:scale-95 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white transition-colors">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            <span className="font-medium">Modifier</span>
                        </button>

                        <button
                            onClick={() => {
                                handleDeletePost();
                                setIsOpen(false);
                            }}
                            className="w-full text-left p-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-all duration-300 active:scale-95 group mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-red-300 transition-colors">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            <span className="font-medium">Supprimer</span>
                        </button>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <></>
        );
    }

}