'use client';

import {useAlert} from "@/components/providers/AlertContext";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";

export default function SendMessageButton({userId}: {userId: number}) {

    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageToSend, setMessageToSend] = useState('');
    const navigate = useRouter();

    const sendMessage = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLoading(true);
        try {
            await AxiosInstance.post(ApiEndpoints.message.sendMessage(userId), { content: messageToSend });
            showAlert(`${messageToSend} envoyé !`, "success");
        } catch (err) {
            showAlert(`${err}`, "error");
        } finally {
            setIsLoading(false);
            navigate.push('/messages');
        }
    }

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setMessageToSend(e.target.value);
    }

    return (
        <>
            <button
                className="btn bg-white text-zinc-900 hover:bg-white/90 border-none rounded-xl shadow-[0_4px_16px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95 font-semibold px-6"
                onClick={() => (document.getElementById('send_message_modal') as HTMLDialogElement).showModal()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                </svg>
                Envoyer un message
            </button>

            <dialog id="send_message_modal" className="modal">
                <div className="modal-box bg-zinc-900 border border-white/5 rounded-2xl shadow-[0_20px_60px_rgba(255,255,255,0.1)] max-w-2xl p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Nouveau message</h3>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                    <path d="m9 12 2 2 4-4"></path>
                                </svg>
                                <span>Soit toujours respectueux dans tes messages !</span>
                            </div>
                        </div>
                        <form method="dialog">
                            <button className="btn btn-ghost btn-sm btn-circle hover:bg-white/5 transition-all duration-300 active:scale-95">
                                ✕
                            </button>
                        </form>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-zinc-800/50 border border-white/5 rounded-xl p-6">
                            <label className="block text-sm font-medium mb-3 text-zinc-400">
                                Ton message
                            </label>
                            <textarea
                                className="w-full bg-zinc-800 border border-white/5 rounded-xl p-4 text-white placeholder:text-zinc-500 focus:border-white/20 focus:ring-2 focus:ring-white/10 shadow-inner transition-all duration-300 resize-none min-h-32"
                                name="caption"
                                value={messageToSend}
                                onChange={handleEditChange}
                                placeholder="Écris ton message ici..."
                                maxLength={500}
                            />
                            <div className="flex items-center justify-between mt-3">
                                <div className="text-xs text-zinc-500">
                                    {messageToSend.length} / 500 caractères
                                </div>
                                {messageToSend.length > 450 && (
                                    <div className="text-xs text-amber-400 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                                            <path d="M12 9v4"></path>
                                            <path d="M12 17h.01"></path>
                                        </svg>
                                        Limite proche
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <form method="dialog">
                                <button
                                    type="button"
                                    className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-xl font-medium transition-all duration-300 active:scale-95 shadow-sm"
                                >
                                    Annuler
                                </button>
                            </form>

                            {isLoading ? (
                                <div className="px-6 py-2.5 bg-white/10 border border-white/5 rounded-xl flex items-center gap-3">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span className="font-medium text-zinc-400">Envoi en cours...</span>
                                </div>
                            ) : (
                                <button
                                    className="px-6 py-2.5 bg-white text-zinc-900 hover:bg-white/90 rounded-xl font-semibold shadow-[0_4px_16px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    onClick={sendMessage}
                                    disabled={!messageToSend.trim()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                                        <path d="M22 2 11 13"></path>
                                    </svg>
                                    Envoyer
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>Fermer</button>
                </form>
            </dialog>
        </>
    );
};