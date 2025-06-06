import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import clsx from "clsx";
import axios from "axios";
import config from "../config";
import UseOutsideClickDetector from "./OutsideClickDetector";
import { Post } from "../types/post";
import { useAlert } from './AlertContext';
import { useNavigate } from "react-router-dom";

export const PostSettings = ({ post }: { post?: Post }) => {

    const { user } = useContext(AuthContext) || {};
    const token = user?.token;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
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

    const leaveContainerRef = UseOutsideClickDetector(() => {
        setIsEditFormPostOpen(false);
    });
    const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleEditCaption = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                `${config.serverUrl}/post/edit/${post?.id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsEditFormPostOpen(false);
            showAlert('Post modifié avec succès', 'success');
        } catch (error: any) {
            if (error.response) {
                const { data, status } = error.response;

                switch (status) {
                    case 400:
                        if (data.error && data.error.includes('caption is too long')) {
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
            await axios.delete(
                `${config.serverUrl}/post/delete/${post?.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showAlert('Post supprimé avec succès', 'success');
            navigate("/profile");
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
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
            <div className="mb-4 flex items-center">
                <label className="flex items-center cursor-pointer transition">
                    <div
                        onClick={onChange}
                        className={clsx(
                            "cursor-pointer w-12 h-6 flex items-center rounded-full px-1 transition-colors duration-200",
                            isOn ? "bg-emerald-500" : "bg-gray-500"
                        )}>
                        <div className={clsx(
                            "w-5 h-4 bg-white rounded-full transition-transform duration-200",
                            isOn ? "translate-x-full" : "translate-x-0"
                        )} />
                    </div>
                    <div className="ml-3 text-sm">Masquer le post</div>
                </label>
            </div>
        )
    }

    const editFormPost = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
                    ref={leaveContainerRef}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Modifier le post</h3>
                        <button
                            onClick={() => setIsEditFormPostOpen(false)}
                            className="text-gray-400 hover:text-white">
                            ✖️
                        </button>
                    </div>

                    <form onSubmit={handleEditCaption}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Légende</label>
                            <textarea
                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                                rows={4}
                                name="caption"
                                value={formData.caption}
                                onChange={handleEditChange}
                                placeholder={post?.caption}
                            />
                        </div>

                        <SwitchBtn isOn={formData.hidden_tag} onChange={toggleHiddenTag} />

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditFormPostOpen(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md">
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
                <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-gray-700 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
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
                                setIsEditFormPostOpen(true);
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
                                handleDeletePost();
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
        );
    } else {
        return (
            <></>
        );
    }

}
