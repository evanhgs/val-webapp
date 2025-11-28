'use client';

import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/components/providers/AuthProvider";
import {useAlert} from "@/components/providers/AlertContext";
import {CommentDTO} from "@/types/Comment";
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";

export const CommentSettings = ({comment, fetchComments}: {comment: CommentDTO;  fetchComments: () => void}) => {

    const { user } = useContext(AuthContext) || {};
    const { showAlert } = useAlert();
    const [isEditFormCommentOpen, setIsEditFormCommentOpen] = useState(false);
    const [formData, setFormData] = useState<string>('');

    useEffect(() => {
        if (comment) {
            setFormData(comment.content);
        }
    }, [comment]);


    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(e.target.value);
    }

    const handleEditComment = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await AxiosInstance.patch(ApiEndpoints.comment.editComment(comment.id), {"content": formData});
            setIsEditFormCommentOpen(false);
            showAlert('Commentaire modifié avec succès', 'success');
            fetchComments()
        } catch (error) {
            const err = error as { response?: { data?: { error?: string }; status?: number } };
            if (err.response) {
                const { status, data } = err.response;
                switch (status) {
                    case 400:
                        showAlert('Le format du commentaire est invalide', 'error');
                        break;
                    case 404:
                        showAlert('Le commentaire n\'a pas été trouvé', 'error');
                        break;
                    case 422:
                        showAlert(data?.error || 'Le contenu du commentaire est invalide', 'error');
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

    const handleDeleteComment = async () => {
        try{
            await AxiosInstance.delete(ApiEndpoints.comment.deleteComment(comment.id));
            showAlert('Commentaire supprimé avec succès', 'success');
            fetchComments();
        } catch (error) {
            const err = error as { response?: { data?: { error?: string }; status?: number } };
            if (err.response) {
                const { status, data } = err.response;
                switch (status) {
                    case 400:
                        showAlert('Le format du commentaire est invalide', 'error');
                        break;
                    case 404:
                        showAlert('Le commentaire n\'a pas été trouvé', 'error');
                        break;
                    case 422:
                        showAlert(data?.error || 'Le contenu du commentaire est invalide', 'error');
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

    const editFormComment = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4">
                <div className="bg-zinc-900 border border-white/5 rounded-2xl shadow-[0_20px_60px_rgba(255,255,255,0.1)] p-8 w-full max-w-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Modifier ton commentaire</h3>
                        <button
                            onClick={() => setIsEditFormCommentOpen(false)}
                            className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full p-2 transition-all duration-300 active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <textarea
                                className="w-full bg-zinc-800 border border-white/5 rounded-xl p-4 text-white placeholder:text-zinc-500 focus:border-white/20 focus:ring-2 focus:ring-white/10 shadow-inner transition-all duration-300 resize-none"
                                rows={4}
                                name="caption"
                                value={formData}
                                onChange={handleEditChange}
                                placeholder={comment?.content || "Écris ton commentaire..."}
                                maxLength={500}
                            />
                            <div className="text-xs text-zinc-500 mt-2 text-right">
                                {formData.length} / 500 caractères
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsEditFormCommentOpen(false)}
                                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-xl font-medium transition-all duration-300 active:scale-95 shadow-sm">
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={handleEditComment}
                                className="px-6 py-2.5 bg-white text-zinc-900 hover:bg-white/90 rounded-xl font-semibold shadow-[0_4px_16px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    if (isEditFormCommentOpen == true) {
        return editFormComment();
    }

    if (String(comment?.user?.id) === String(user?.id)) {
        return (
            <div className="dropdown dropdown-left dropdown-center">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-sm hover:bg-white/5 transition-all duration-300 active:scale-95 rounded-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="6" r="1"></circle>
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="18" r="1"></circle>
                    </svg>
                </div>

                <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-zinc-900 border border-white/5 rounded-xl z-50 w-48 p-2 shadow-[0_12px_40px_rgba(255,255,255,0.1)] backdrop-blur-sm"
                >
                    <li>
                        <a
                            onClick={() => {setIsEditFormCommentOpen(true);}}
                            className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-all duration-300 active:scale-95 group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white transition-colors">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            <span className="font-medium">Modifier</span>
                        </a>
                    </li>
                    <li>
                        <a
                            className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 active:scale-95 group"
                            onClick={() => {handleDeleteComment();}}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-red-300 transition-colors">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            <span className="font-medium">Supprimer</span>
                        </a>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <></>
    );
};