import {MqttClient} from "mqtt";

export function useMQTTPublish(client: MqttClient) {
    const publish = (
        topic: string,
        message: string | Buffer,
        options: Record<string, unknown> = {}
    ) => {
        if (client && client.connected) {
            client.publish(topic, message, options);
        }
    };
    return publish;
}
