import {useContext, useEffect, useRef, useState} from "react";
import {API_MQTT_PASSWORD, API_MQTT_USER, API_MQTT_WSS, AxiosInstance, Config} from "../../../config/config.ts";
import {ConversationContent, Message} from "../../../types/Message.ts";
import {shortPipeDate} from "../../../config/PipeDate.ts";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../components/Context/AuthContext.tsx";
import {useAlert} from "../../../components/Context/AlertContext.tsx";
import mqtt, {MqttClient} from "mqtt";

export const Page = ({ convId }: { convId: number }) => {
    const [conversationContent, setConversationContent] = useState<ConversationContent | null>(null);
    const navigate = useNavigate();
    const msgEndRef = useRef<HTMLDivElement | null>(null);
    const { user } = useContext(AuthContext) || {};
    const [newMessage, setNewMessage] = useState("");
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);

    /** fonctionnement du chat avec MQTT
     * ouverture de la conversation
     * abonnement au topic de la conversation (chat/{convId}/messages)
     * quand un message est reçu, on l'ajoute à la liste des messages
     * les messages sont gérés sur l'api
     * */


    // scroll auto en bas quand nouveaux messages
    useEffect(() => {
        if (msgEndRef.current) {
            msgEndRef.current.scrollTo({
                top: msgEndRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [conversationContent]);

    useEffect(() => {
        const client = mqtt.connect(API_MQTT_WSS, {
            username: API_MQTT_USER,
            password: API_MQTT_PASSWORD,
        });

        client.on('connect', () => {
            console.log('Connection à la messagerie');
            client.subscribe(`chat/${convId}/messages`);
        });
        client.on('error', (err) => console.error('MQTT error:', err));
        setMqttClient(client);
        return () => {
            client.end(true);
        };
    }, [convId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !conversationContent) return;

        const { user1, user2 } = conversationContent.conversation;
        const otherUserId =
            Number(user1.id) === Number(user.id) ? Number(user2.id) : Number(user1.id);

        if (!otherUserId) return;

        try {
            await AxiosInstance.post(
                Config.message.sendMessage(otherUserId),
                { content: newMessage }
            );

            setNewMessage("");
            showAlert("Message envoyé !", "success");
        } catch (err) {
            showAlert(`${err}`, "error");
        }
    };

    useEffect(() => {
        fetchConversation();
    }, [convId]);

    const fetchConversation = async () => {
        try {
            setLoading(true);
            const response = await AxiosInstance.get(Config.message.getConversationContent(convId));
            setConversationContent(response.data);
        } catch (err) {
            showAlert(`${err}`, "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!mqttClient) return;

        const handleMessage = (topic: string, message: Buffer) => {
            if (topic === `chat/${convId}/messages`) {
                try {
                    const parsed: Message = JSON.parse(message.toString());
                    setConversationContent((prev) =>
                        prev ? { ...prev, messages: [...prev.messages, parsed] } : prev
                    );
                } catch (e) {
                    console.error('Erreur de parsing message:', e);
                }
            }
        };

        mqttClient.on('message', handleMessage);
        return () => {
            mqttClient.off('message', handleMessage);
        };
    }, [mqttClient, convId]);



    return (
        <div className="bg-base-100 rounded-box shadow-md w-full max-h-[500px] flex flex-col overflow-auto md:max-h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={msgEndRef}>
                {loading ? (
                    <span className="loading loading-spinner loading-xl"></span>
                ) : conversationContent ? (
                    conversationContent.messages.map((message) => {
                        if (!message.sender) return null;
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
                                                Config.user.picture(message.sender.profile_picture) ??
                                                Config.user.defaultPicture()
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

            <div className="p-4 flex gap-2">
                <input
                    type="text"
                    placeholder="écrire un message..."
                    className="input input-bordered w-full"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>
                    Envoyer
                </button>
            </div>
        </div>
    );
};
