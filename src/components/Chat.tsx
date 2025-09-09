import { useEffect, useRef, useState, useContext } from "react";
import { ApiEndpoints, AxiosInstance } from "../services/apiEndpoints";
import { ConversationContent } from "../types/message";
import { shortPipeDate } from "./PipeDate";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const Chat = ({ convId }: { convId: number }) => {
    const [conversationContent, setConversationContent] = useState<ConversationContent | null>(null);
    const navigate = useNavigate();
    const msgEndRef = useRef<HTMLDivElement | null>(null);
    const { user } = useContext(AuthContext) || {};

    useEffect(() => {
        const fetchConvContent = async () => {
            const response = await AxiosInstance.get(ApiEndpoints.message.getConversationContent(convId));
            setConversationContent(response.data);
        };
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
                    conversationContent.messages.map((message) => {
                        const isCurrentUser = String(message.sender.id) === String(user?.id);

                        return (
                            <div
                                key={message.id}
                                className={`chat ${isCurrentUser ? "chat-start" : "chat-end"}`}
                            >
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full">
                                        <img
                                            alt={message.sender.username}
                                            src={
                                                ApiEndpoints.user.picture(message.sender.profile_picture) ??
                                                ApiEndpoints.user.defaultPicture()
                                            }
                                        />
                                    </div>
                                </div>

                                <div
                                    className="chat-header hover:cursor-pointer"
                                    onClick={() => navigate(`/profile/${message.sender.username}`)}
                                >
                                    {message.sender.username}
                                    <time className="text-xs opacity-50">
                                        {shortPipeDate(message.created_at.toString())}
                                    </time>
                                </div>

                                <div className="chat-bubble">{message.content}</div>

                                <div className="chat-footer opacity-50">
                                    {message.isRead && (
                                        <span>Vu {shortPipeDate(message.updated_at.toString())}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>Vous n'avez pas de message avec cet utilisateur.</p>
                )}
            </div>

            <div className="p-4">
                <input
                    type="text"
                    placeholder="écrire un message..."
                    className="input input-bordered w-full"
                />
            </div>
        </div>
    );
};
