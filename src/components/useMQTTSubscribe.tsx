import {useEffect} from "react";
import {MqttClient} from "mqtt";

type OnMessageCallback = (payload: string) => void;

export function useMQTTSubscribe(
    client: MqttClient | null,
    topic: string,
    onMessage: OnMessageCallback
) {
    useEffect(() => {
        if (!client || !client.connected) return;
        const handleMsg = (receivedTopic: string, message: Buffer) => {
            if (receivedTopic === topic) {
                onMessage(message.toString());
            }
        };
        client.subscribe(topic);
        client.on('message', handleMsg);
        return () => {
            client.unsubscribe(topic);
            client.off('message', handleMsg);
        };
    }, [client, topic, onMessage]);
}
