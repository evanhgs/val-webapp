'use client';

import {UploadButtonProps} from "@/types/UploadProps";
import {AuthContext} from "@/components/providers/AuthProvider";
import React, {useContext, useState} from "react";
import {useAlert} from "@/components/providers/AlertContext";
import {ApiEndpoints, AxiosInstanceFormData} from "@/lib/endpoints";

export default function UploadButton({ setIsUploading }: UploadButtonProps) {

    const { user } = useContext(AuthContext) || {};
    const [error, setError] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<string>(user?.profile_picture || "");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { showAlert } = useAlert();

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setProfilePicture(URL.createObjectURL(file)); // permet un rendu instant sur un nouvel onglet
            setError('');
        } else {
            setError('Aucune image sélectionnée');
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setError('Veuillez sélectionner une image avant de valider');
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", selectedFile); // wait "file" api side
            await AxiosInstanceFormData.post(ApiEndpoints.user.uploadPicture(), formData);
            setIsUploading(false);
            showAlert('Photo de profil mise à jour avec succès', 'success');
            await new Promise(resolve => setTimeout(resolve, 2000));
            window.location.reload();
        } catch (error) {
            console.error(error);
            setError("Erreur lors de l'upload de la photo de profil");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/5">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-white tracking-wide">
                        Modifier la photo de profil
                    </h2>
                    <button
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
                        onClick={() => setIsUploading(false)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Aperçu */}
                <div className="mb-8 text-center">
                    <p className="text-sm text-zinc-300 mb-3">Aperçu de l'image</p>
                    <div className="w-28 h-28 rounded-full overflow-hidden mx-auto border border-white/10 shadow-lg bg-zinc-800">
                        {profilePicture ? (
                            <img
                                src={profilePicture}
                                alt="Aperçu"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
                                Aucune image
                            </div>
                        )}
                    </div>
                </div>

                {/* Input file */}
                <div className="mb-6 space-y-2">
                    <label className="text-sm text-zinc-300">
                        Sélectionner une image
                    </label>

                    <input
                        type="file"
                        onChange={handleChange}
                        className="w-full cursor-pointer rounded-xl border border-white/5 bg-zinc-800 text-white
                     shadow-inner shadow-black/40 outline-none transition
                     file:mr-4 file:border-0 file:bg-white file:text-zinc-900
                     file:px-5 file:py-2 file:rounded-lg file:font-medium
                     hover:file:shadow-[0_5px_20px_rgba(255,255,255,0.25)]"
                    />

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={() => setIsUploading(false)}
                        className="px-5 py-2.5 rounded-xl bg-zinc-700 text-white
                     hover:bg-zinc-600 transition"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedFile}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition
            ${selectedFile
                            ? "bg-white text-zinc-900 shadow-[0_10px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.35)] active:scale-[0.98]"
                            : "bg-white/40 text-zinc-700 cursor-not-allowed"
                        }`}
                    >
                        Valider et enregistrer
                    </button>
                </div>

            </div>
        </div>
    );

}