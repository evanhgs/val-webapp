'use client';

import React, { useContext, useState } from 'react';
import {AuthContext} from "@/components/providers/AuthProvider";
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";
import PhoneCarousel from "@/components/ui/Carousel";
import { useRouter } from 'next/navigation';
import {useAlert} from "@/components/providers/AlertContext";
import {AxiosError} from "axios";

export default function RegisterForm(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { login } = useContext(AuthContext) || {};
    const router = useRouter();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            showAlert('Le nom d\'utilisateur est requis', 'info');
            return;
        }

        if (!validateEmail(email)) {
            showAlert('Veuillez entrer une adresse email valide', 'info');
            return;
        }

        if (password.length < 6) {
            showAlert('Le mot de passe doit contenir 6 caractères minimum', 'info');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Les mots de passe ne correspondent pas', 'info');
            return;
        }

        try {
            setLoading(true);
            const response = await AxiosInstance.post(ApiEndpoints.auth.register(), { username, email, password });
            if (login) {
                login(
                    response.data.token,
                    response.data.username,
                    response.data.profile_picture,
                    response.data.id
                );
                showAlert('Inscription réussie', 'success');
                router.push("/login");
            } else {
                showAlert('Vous n\'êtes pas choisi par la sélection naturelle', 'error');
            }
        } catch (error) {
            handleRegisterError(error as AxiosError);
        } finally {
            setLoading(false);
        }
    };

    // Gestion des erreurs pour le register
    const handleRegisterError = (error: AxiosError) => {
        console.error("Erreur lors du suivi:", error);
        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 400:
                    showAlert('Le nom d\'utilisateur ou l\'adresse email est déjà utilisée', 'info');
                    break;
                case 422:
                    showAlert('Une erreur sur la syntaxe est survenue, veuillez corriger votre orthographe', 'error');
                    break;
                case 500:
                    showAlert('Une erreur serveur est survenue, réessayez plus tard ou allez harceler le dev ', 'error');
                    break;
                default:
                    showAlert('Une erreur est survenue', 'error');
            }
        } else if (error.request) {
            showAlert("Erreur réseau lors de l'enregistrement", 'error');
        } else {
            showAlert("Une erreur inattendue est survenue, même moi je ne sais pas ?", 'error');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            {/* Conteneur principal */}
            <div className="flex flex-col md:flex-row items-center space-y-10 md:space-y-0 md:space-x-10">

                <PhoneCarousel />

                {/* Formulaire d'inscription */}
                <div className="bg-zinc-900 p-8 rounded-lg w-80 border border-white/60 shadow-[0_0_18px_rgba(255,255,255,0.35)]">
                    <h1 className="text-3xl font-bold text-center mb-6 text-zinc-300">Inscription</h1>
                    <form onSubmit={handleSubmit} >
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            className="w-full p-3 rounded bg-zinc-800 focus:outline-none mb-3"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Adresse mail"
                            className="w-full p-3 rounded bg-zinc-800 focus:outline-none mb-3"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Mot de passe"
                            className="w-full p-3 rounded bg-zinc-800 focus:outline-none mb-3"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Valider le mot de passe"
                            className="w-full p-3 rounded bg-zinc-800 focus:outline-none mb-3"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            S'inscrire
                        </button>
                    </form>

                    {/* Lien connexion */}
                    <div className="mt-6 text-center text-zinc-300">
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="text-zinc-200 cursor-pointer"
                        >
                            Vous avez déjà un compte ?
                            Se connecter
                        </button>
                    </div>

                </div>
            </div>


        </div>
    );
};