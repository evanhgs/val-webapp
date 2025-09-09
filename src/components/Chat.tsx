import {useEffect, useRef, useState} from "react";
import {ApiEndpoints, AxiosInstance} from "../services/apiEndpoints.ts";
import {ConversationContent} from "../types/message.ts";
import {shortPipeDate} from "./PipeDate.ts";
import {useNavigate} from "react-router-dom";

export const Chat = ({ convId }: {convId: number}) => {

    const [conversationContent, setConversationContent] = useState<ConversationContent | null>(null);
    const navigate = useNavigate();
    const msgEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchConvContent = async () => {
            const response = await AxiosInstance.get(ApiEndpoints.message.getConversationContent(convId));
            console.log(response.data)
            setConversationContent(response.data);
        }
        fetchConvContent();
    }, [convId]);

    useEffect(() => {
        if (msgEndRef.current) {
            msgEndRef.current.scrollTo({top: msgEndRef.current.scrollHeight, behavior: "smooth",});
        }
    }, [conversationContent]);

    return (
        <div className="bg-base-100 rounded-box shadow-md w-full max-h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={msgEndRef}>
            {conversationContent ? (
                conversationContent.messages.map((message) => (
                    <div key={message.id}>
                        {/* current user (left side) */}
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt={conversationContent.conversation.user1.username}
                                        src={ApiEndpoints.user.picture(conversationContent?.conversation.user1.profile_picture)}
                                    />
                                </div>
                            </div>
                            <div
                                className="chat-header hover:cursor-pointer"
                                onClick={() => {navigate(`/profile/${conversationContent?.conversation.user1.username}`)}}
                            >
                                {conversationContent?.conversation.user1.username}
                                <time className="text-xs opacity-50">{shortPipeDate(message?.created_at.toString())}</time>
                            </div>
                            <div className="chat-bubble">{message.content}</div>
                            <div className="chat-footer opacity-50">
                                {message.isRead ? (
                                    <span>
                                        Vu {shortPipeDate(message?.updated_at.toString())}
                                    </span>
                                    ): (
                                        <></>
                                    )
                                }
                            </div>
                        </div>

                        {/* other user (right side) */}
                        <div className="chat chat-end">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">s
                                Anakin
                                <time className="text-xs opacity-50">12:46</time>
                            </div>
                            <div className="chat-bubble">I hate you!</div>
                            <div className="chat-footer opacity-50">Seen at 12:46</div>
                        </div>
                    </div>
                ))
            ) : (
                <>
                    <p>Nothing to see here</p>
                </>
            )}
            </div>
            <div className="p-4 ">
                <input
                    type="text"
                    placeholder="écrire un message..."
                    className="input input-bordered w-full"
                />
            </div>
        </div>
    );
};
