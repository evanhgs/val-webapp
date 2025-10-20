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
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn" onClick={()=>
                (document.getElementById('send_message_modal') as HTMLDialogElement).showModal()}>Envoyer un message</button>
            <dialog id="send_message_modal" className="modal">
                <div className="modal-box">
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <div className="tooltip" data-tip="Soit toujours respectueux dans tes messages !">
                            <legend className="fieldset-legend">Ton message</legend>

                        </div>
                        <div className="join gap-2 w-full">
                            <textarea
                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                                name="caption"
                                value={messageToSend}
                                onChange={handleEditChange}
                                maxLength={500}
                            />
                            { isLoading ? (
                                <span className="loading loading-spinner loading-md"></span>
                            ) : (
                                <button className="btn btn-outline join-item" onClick={sendMessage}>envoyer</button>
                            ) }
                        </div>
                        <p className="text-gray-500 text-sm">
                            {messageToSend.length} / 500
                        </p>
                    </fieldset>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>


        </>
    );
};