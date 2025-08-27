import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "./AuthContext.tsx";
import {useAlert} from "./AlertContext.tsx";
import {Comment} from "../types/comment.ts";
import UseOutsideClickDetector from "./OutsideClickDetector.tsx";
import {ApiEndpoints, AxiosInstance} from "../services/apiEndpoints.ts";

export const CommentSettings = ({comment}: {comment: Comment}) => {

    const { user } = useContext(AuthContext) || {};
    const { showAlert } = useAlert();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditFormCommentOpen, setIsEditFormCommentOpen] = useState(false);
    const [formData, setFormData] = useState("");

    useEffect(() => {
        if (comment) {
            setFormData(comment.content);
        }
    }, [comment]);

    const leaveContainerRef = UseOutsideClickDetector(() => {
        setIsEditFormCommentOpen(false);
    });

    const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(e.target.value);
    }

    const handleEditComment = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await AxiosInstance.patch(ApiEndpoints.comment.editComment(comment.id), formData);
            setIsEditFormCommentOpen(false);
            showAlert('Commentaire modifié avec succès', 'success');
            await new Promise(resolve => setTimeout(resolve, 2000));
            window.location.reload();
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
            await new Promise(resolve => setTimeout(resolve, 2000));
            window.location.reload();
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
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
                     ref={leaveContainerRef}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Modifier le post</h3>
                        <button
                            onClick={() => setIsEditFormCommentOpen(false)}
                            className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleEditComment}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Commentaire</label>
                            <textarea
                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                                rows={4}
                                name="caption"
                                value={formData}
                                onChange={handleEditChange}
                                placeholder={comment?.content}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditFormCommentOpen(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="btn btn-ghost px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md">
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

    if (String(comment?.user?.id) === user?.id) { // trash code...
        return (
            <div className="relative">
                <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-gray-700 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="6" r="1"></circle>
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="18" r="1"></circle>
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-8 bg-gray-800 rounded-md shadow-lg p-2 z-20 w-40 border border-gray-700">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-1 mb-2">
                            <span className="text-sm font-medium">Options</span>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">×</button>
                        </div>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setIsEditFormCommentOpen(true);
                            }}
                            className="w-full text-left p-2 text-sm hover:bg-gray-700 rounded flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Modifier
                        </button>

                        <button
                            onClick={() => {
                                handleDeleteComment();
                                setIsOpen(false);
                            }}
                            className="w-full text-left p-2 text-sm text-red-400 hover:bg-gray-700 rounded flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Supprimer
                        </button>
                    </div>
                )}
            </div>
        )
    }
    return (
        <></>
    );
};
