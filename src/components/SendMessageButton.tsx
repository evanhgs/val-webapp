import React, {useContext, useEffect, useState} from "react";
import {useAlert} from "./AlertContext.tsx";
import {AuthContext} from "./AuthContext.tsx";
import {ApiEndpoints, AxiosInstance} from "../services/apiEndpoints.ts";
import {Message} from "../types/message.ts";

interface SendMessageProps {
    userId: number;
}

const SendMessageButton: React.FC<SendMessageProps> = ({userId}) => {
    const { showAlert } = useAlert();
    const { user } = useContext(AuthContext) || {};
    const token = user?.token;
    const [messageSent, setMessageSent] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageToSend, setMessageToSend] = useState<Message | null>(null);


    const sendMessage = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await AxiosInstance.post(ApiEndpoints.message.sendMessage(userId), { content: messageToSend });
            showAlert(`${messageToSend} envoyé !`, "success");
        } catch (err) {
            showAlert(`${err}`, "error");
        }
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
                        <div className="join">
                            <input type="text" className="input join-item"/>
                            <button className="btn join-item">envoyer</button>
                        </div>
                    </fieldset>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>


        </>
    );
};

export default SendMessageButton;