'use client';

import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {UserEditProfile} from "@/types/User";
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";

export default function EditProfileForm({ userData, setIsEditing, onUpdateAlert }: { userData: any; setIsEditing: (isEditing: boolean) => void; onUpdateAlert: (message: string, type: "success" | "error") => void }) {

    const navigate = useRouter();
    const [formData, setFormData] = useState<UserEditProfile>({
        username: userData.username,
        email: userData.email,
        bio: userData.bio || "",
        website: userData.website || "",
        gender: userData.gender || "Autre",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AxiosInstance.post(ApiEndpoints.user.edit(), formData);

            setIsEditing(false);
            onUpdateAlert("Profil mis à jour avec succès", "success");
            await new Promise(resolve => setTimeout(resolve, 2000));
            window.location.reload();
        } catch (error) {
            onUpdateAlert(`Erreur lors de la mise à jour: ${error}`, "error");
        }
        navigate.push("/profile");
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/5">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-white tracking-wide">
                        Modifier le profil
                    </h2>
                    <button
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
                        onClick={() => setIsEditing(false)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Champ générique */}
                    {[
                        { label: "Nom d'utilisateur", name: "username", type: "text", max: 20 },
                        { label: "Ton email", name: "email", type: "email", max: 200 },
                        { label: "Site web", name: "website", type: "text", max: 32 },
                    ].map((field) => (
                        <div key={field.name} className="space-y-1">
                            <label className="text-sm text-zinc-300">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={(formData as any)[field.name]}
                                onChange={handleChange}
                                maxLength={field.max}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white border border-white/5
                         shadow-inner shadow-black/40
                         focus:outline-none focus:ring-2 focus:ring-white/10
                         transition"
                            />
                            <p className="text-xs text-zinc-500 text-right">
                                {(formData as any)[field.name].length} / {field.max}
                            </p>
                        </div>
                    ))}

                    {/* Bio */}
                    <div className="space-y-1">
                        <label className="text-sm text-zinc-300">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            maxLength={100}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white border border-white/5
                       shadow-inner shadow-black/40 h-24 resize-none
                       focus:outline-none focus:ring-2 focus:ring-white/10 transition"
                        />
                        <p className="text-xs text-zinc-500 text-right">
                            {formData.bio.length} / 100
                        </p>
                    </div>

                    {/* Genre */}
                    <div className="space-y-1">
                        <label className="text-sm text-zinc-300">Genre</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white border border-white/5
                       shadow-inner shadow-black/40
                       focus:outline-none focus:ring-2 focus:ring-white/10 transition"
                        >
                            <option value="Homme">Homme</option>
                            <option value="Femme">Femme</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full mt-6 py-3 rounded-xl bg-white text-zinc-900 font-semibold
                     shadow-[0_10px_30px_rgba(255,255,255,0.25)]
                     hover:shadow-[0_15px_40px_rgba(255,255,255,0.35)]
                     active:scale-[0.98] transition"
                    >
                        Confirmer
                    </button>
                </form>
            </div>
        </div>
    );

};