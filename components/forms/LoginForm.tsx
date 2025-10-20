'use client';

import React, { useContext, useState } from 'react';
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";
import {AuthContext} from "@/components/providers/AuthProvider";
import PhoneCarousel from "@/components/ui/Carousel";
import { useRouter } from 'next/navigation';
import {useAlert} from "@/components/providers/AlertContext";
import {AxiosError} from "axios";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext) || {};
    const router = useRouter();
    const { showAlert } = useAlert();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            showAlert("Le nom d'utilisateur est requis.", "info");
            return;
        }
        if (password.length < 6) {
            showAlert("Le mot de passe doit contenir au moins 6 caractères.", "info");
            return;
        }

        try {
            setLoading(true);

            const response = await AxiosInstance.post(ApiEndpoints.auth.login(), {
                username,
                password,
            });
            if (login) {
                login(
                    response.data.token,
                    response.data.user_id,
                    response.data.profile_picture,
                    response.data.username
                );
                showAlert("Connexion réussie", "success");
                router.push("/");
            } else {
                showAlert("Erreur interne, impossible de se connecter, essayez plus tard", "error");
            }
        } catch (err) {
            handleLoginError(err as AxiosError);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginError = (error: AxiosError) => {
        console.error("Erreur lors de la connexion:", error);

        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 400:
                case 401:
                    showAlert("Nom d'utilisateur ou mot de passe incorrect.", "error");
                    break;
                case 422:
                    showAlert("Données invalides. Vérifiez votre saisie.", "info");
                    break;
                case 500:
                    showAlert("Erreur serveur, réessayez plus tard.", "error");
                    break;
                default:
                    showAlert("Une erreur est survenue. Réessayez plus tard.", "error");
            }
        } else if (error.request) {
            showAlert("Erreur réseau — vérifiez votre connexion.", "error");
        } else {
            showAlert("Une erreur inattendue est survenue.", "error");
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {/* Conteneur principal */}
            <div className="flex flex-col md:flex-row items-center space-y-10 md:space-y-0 md:space-x-10">
                {/* Carousel de téléphone */}
                <PhoneCarousel />

                {/* Formulaire de connexion */}
                <div className="bg-zinc-900 p-8 rounded-lg w-80 border border-white/60 shadow-[0_0_18px_rgba(255,255,255,0.35)]">
                    <h1 className="text-3xl font-bold text-center mb-6 text-zinc-300">Connexion</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            className="w-full p-3 rounded bg-zinc-800 focus:outline-none mb-3"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            className="w-full p-3 rounded bg-zinc-800 focus:outline-none mb-3"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full p-3 rounded font-bold transition-colors ${
                                loading
                                    ? "bg-zinc-500 cursor-not-allowed"
                                    : "bg-zinc-700 hover:bg-zinc-400 hover:text-zinc-900 cursor-pointer text-zinc-200"
                            }`}
                        >
                            Se connecter
                        </button>
                    </form>


                    <div className="mt-6 text-center text-zinc-300">
                        <button
                            type="button"
                            onClick={() => router.push("/register")}
                            className="text-zinc-200 cursor-pointer"
                        >
                            Vous n'avez pas de compte ?
                            S'inscrire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};