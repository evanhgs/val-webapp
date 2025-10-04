import { AuthContext } from "../components/AuthContext.tsx";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../components/AlertContext.tsx";
import {ApiEndpoints, AxiosInstanceFormData} from "../services/apiEndpoints.ts";

const UploadPost = () => {

    const { showAlert } = useAlert();
    const { user } = useContext(AuthContext) || {};
    const token = user?.token;
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [caption, setCaption] = useState<string>("");

    useEffect(() => {
        if (!token) {
            setError("Vous devez être connecté pour publier un post.");
            navigate("/login");
            return;
        }
    }, [token, navigate])

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            setError("");
        } else {
            setError("Aucune image sélectionnée");
        }
    }
    const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (caption.length <= 200) {
            setCaption(text);
        }
    };


    const handleSubmit = async () => {
        if (!file) {
            setError("Veuillez sélectionner une image avant de publier.");
            return;
        } try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("caption", caption);
            await AxiosInstanceFormData.post(ApiEndpoints.post.postUpload(), formData);
            setFile(null);
            setError("");
            setCaption("");
            showAlert('Post publié avec succès', 'success');
            navigate("/profile")

        } catch (error) {
            console.error("Error fetching post:", error);
            const err = error as { response?: { status: number } };
            if (err.response) {
                const { status } = err.response;
                switch (status) {
                    case 401:
                        showAlert('Vous devez être connecté pour modifier ce post', 'error');
                        break;
                    case 404:
                        showAlert('Le fichier n\'a pas été trouvé ou n\'est pas sélectionné', 'error');
                        break;
                    case 500:
                        showAlert('Une erreur serveur est survenue', 'error');
                        break;
                    case 406:
                        showAlert('Dommage... ^^', 'info');
                        break;
                    default:
                        showAlert('Une erreur inattendue s\'est produite', 'error');
                }
            }
        }
    };


    return (
        <>
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Ajoute une photo pour la partager au monde !</h2>
                    <button
                        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none">

                    </button>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <div className='mb-4'>
                    <input
                        type='file'
                        className='w-full cursor-pointer rounded-md border border-gray-600 bg-gray-800 text-white outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-gray-600 file:bg-gray-700 file:py-3 file:px-5 file:text-white file:hover:bg-blue-500 file:hover:bg-opacity-20'
                        onChange={handleChange} />
                    {error && <p className='text-red-500 mt-2'>{error}</p>}
                </div>
                <div className="flex flex-wrap flex-col w-full mb-4">
                    <textarea
                        className="w-full rounded-md border border-gray-600 bg-gray-800 outline-none focus:outline-none p-2"
                        placeholder="Ajouter une légende..."
                        value={caption}
                        onChange={handleCaptionChange}
                        maxLength={200}
                    />
                    <div className="flex justify-end text-sm text-gray-400 mt-1">
                        {caption.length}/200 caractères
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                            onClick={() => navigate(-1)}>
                        Annuler
                    </button>
                    <button
                        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center ${!File ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleSubmit}
                        disabled={!file}
                    >  Valider et enregistrer
                    </button>
                </div>
            </div>


        </>

    );
}

export default UploadPost;
