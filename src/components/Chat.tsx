import { useEffect, useRef, useState, useContext, useCallback } from "react";
import {API_MQTT_PASSWORD, API_MQTT_USER, API_MQTT_WSS, ApiEndpoints, AxiosInstance} from "../services/apiEndpoints";
import { ConversationContent, Message } from "../types/message";
import { shortPipeDate } from "./PipeDate";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useAlert } from "./AlertContext.tsx";
import mqtt, { MqttClient } from "mqtt";

export const Chat = ({ convId }: { convId: number }) => {
    const [conversationContent, setConversationContent] = useState<ConversationContent | null>(null);
    const navigate = useNavigate();
    const msgEndRef = useRef<HTMLDivElement | null>(null);
    const { user } = useContext(AuthContext) || {};
    const [newMessage, setNewMessage] = useState("");
    const { showAlert } = useAlert();

    //const mqttClientRef = useRef<MqttClient | null>(null);
    const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
    const topic = `chat/${convId}/messages`;

    // callback pour les messages MQTT
    const handleMQTTMessage = useCallback(
        (payload: string) => {
            try {
                const parsed: Message = JSON.parse(payload);
                console.log("message envoyé par votre ami:", parsed)
                setConversationContent((prev) =>
                    prev ? { ...prev, messages: [...prev.messages, parsed] } : prev
                );
            } catch (err) {
                console.error("Invalid MQTT message:", err);
            }
        },
        []
    );

    // init MQTT
    useEffect(() => {
        const client = mqtt.connect(API_MQTT_WSS, {
            username: API_MQTT_USER,
            password: API_MQTT_PASSWORD
        });
        //mqttClientRef.current = mqttClient;
        console.log("MQTT client créé", client.connected);

        setMqttClient(client)

        client.on("connect", () => {
            console.log("Connected to broker");
        });

        // fetch contenu conv initial
        const fetchConvContent = async () => {
            const response = await AxiosInstance.get(
                ApiEndpoints.message.getConversationContent(convId)
            );
            setConversationContent(response.data);
        };
        fetchConvContent();

        return () => {
            client.end();
            setMqttClient(null)
        };
    }, [convId]);

    // souscription via hook custom
    // useMQTTSubscribe(mqttClient, topic, handleMQTTMessage);

    // scroll auto en bas quand nouveaux messages
    useEffect(() => {
        if (msgEndRef.current) {
            msgEndRef.current.scrollTo({
                top: msgEndRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [conversationContent]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !conversationContent) return;

        const { user1, user2 } = conversationContent.conversation;
        const otherUserId =
            Number(user1.id) === Number(user.id) ? Number(user2.id) : Number(user1.id);

        if (!otherUserId) return;

        try {
            const response = await AxiosInstance.post(
                ApiEndpoints.message.sendMessage(otherUserId),
                { content: newMessage }
            );
            console.log("message envoyé coté client")
            const sentMsg: Message = response.data;
            setConversationContent((prev) =>
                prev ? { ...prev, messages: [...prev.messages, sentMsg] } : prev
            );
            console.log("console test")
            if (mqttClient) {
                mqttClient.publish(topic, JSON.stringify(sentMsg), {qos: 1, retain: true}, () => console.log("abonné"));
                console.log("message reçu coté client")
            }

            setNewMessage("");
            showAlert("Message envoyé !", "success");
        } catch (err) {
            showAlert(`${err}`, "error");
        }
    };

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
