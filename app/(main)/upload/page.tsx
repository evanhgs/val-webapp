'use client';

import {useAlert} from "@/components/providers/AlertContext";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/components/providers/AuthProvider";
import {useRouter} from "next/navigation";
import {ApiEndpoints, AxiosInstanceFormData} from "@/lib/endpoints";

export default function UploadPage(){

    const { showAlert } = useAlert();
    const { user, isLoading } = useContext(AuthContext) || {};
    const token = user?.token;
    const navigate = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [caption, setCaption] = useState<string>("");

    useEffect(() => {
        if (isLoading) return;
        if (!token) {
            setError("Vous devez être connecté pour publier un post.");
            navigate.push("/login");
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
            navigate.push("/profile")

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
        <div className="max-w-2xl mx-auto px-4 min-h-screen content-center">

            <div className="relative rounded-2xl
                    bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900
                    border border-white/5
                    shadow-[0_0_40px_rgba(255,255,255,0.05)]
                    overflow-hidden p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">
                        Ajouter une photo
                    </h2>

                    <button
                        onClick={() => navigate.back()}
                        className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Upload */}
                <div className="mb-5">
                    <input
                        type="file"
                        onChange={handleChange}
                        className="w-full cursor-pointer rounded-xl
                     bg-zinc-800 border border-white/10
                     text-white px-4 py-3
                     file:mr-4 file:bg-white file:text-zinc-900
                     file:border-0 file:rounded-lg
                     file:px-4 file:py-2
                     hover:file:bg-gray-200 transition"
                    />
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>

                {/* Caption */}
                <div className="mb-6">
        <textarea
            className="w-full min-h-[100px] rounded-xl
                     bg-zinc-800 border border-white/10
                     px-4 py-3 text-white
                     focus:outline-none focus:ring-2 focus:ring-white/10"
            placeholder="Ajouter une légende..."
            value={caption}
            onChange={handleCaptionChange}
            maxLength={200}
        />
                    <div className="flex justify-end text-xs text-zinc-500 mt-1">
                        {caption.length}/200
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => navigate.back()}
                        className="px-5 py-2 rounded-xl
                     bg-zinc-700 text-white
                     hover:bg-zinc-600 transition"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!file}
                        className={`px-6 py-2 rounded-xl font-semibold
                        ${file ? "bg-white text-zinc-900 shadow-[0_10px_30px_rgba(255,255,255,0.25)] " +
                            "hover:shadow-[0_15px_40px_rgba(255,255,255,0.35)] active:scale-[0.98]" : 
                            "bg-zinc-700 text-zinc-400 cursor-not-allowed"} transition`}
                    >
                        Publier
                    </button>
                </div>

            </div>

        </div>
    );

}