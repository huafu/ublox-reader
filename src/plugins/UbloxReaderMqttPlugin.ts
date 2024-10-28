import mqtt, { IClientPublishOptions } from "mqtt";
import { SentenceId } from "../constants";
import { PluginConfig } from "../helpers/config";
import UbloxMessage from "../messages/UbloxMessage";
import UbloxDevice from "../UbloxDevice";
import UbloxReaderPlugin from "./UbloxReaderPlugin";

export interface UbloxReaderMqttPluginConfig extends PluginConfig {
    host: string;
    port?: number;
    username?: string;
    password?: string;
    topic?: string;
    qos?: IClientPublishOptions["qos"];
    retain?: boolean;
    messages?: SentenceId[];
}

enum Status {
    online = "online",
    offline = "offline",
}

export default class UbloxReaderMqttPlugin extends UbloxReaderPlugin<UbloxReaderMqttPluginConfig> {
    readonly name = "console";
    protected client: mqtt.MqttClient | undefined;

    setup(device: UbloxDevice) {
        // setup MQTT client
        const { host, port = 1883, username, password, topic } = this.config;
        const client = (this.client = mqtt.connect({
            host,
            port,
            username,
            password,
            will: {
                topic: `${topic}/status`,
                payload: Status.offline as unknown as Buffer,
                retain: true,
            },
        }));
        client.on("connect", () => {
            client?.publish(`${topic}/status`, Status.online, {
                retain: true,
            });
        });

        // bind event handlers
        const { messages } = this.config;
        if (messages) {
            messages.forEach((message) => {
                device.onMessageOfType(message, this.handleMessage.bind(this));
            });
        } else {
            device.on("message", this.handleMessage.bind(this));
        }
    }

    teardown(): void {
        this.client?.end();
    }

    handleMessage(message: UbloxMessage) {
        const { topic, qos, retain } = this.config;
        const fullTopic = `${topic}/${message.sentenceId.toLowerCase()}`;
        const payload = JSON.stringify(message);
        this.client?.publish(fullTopic, payload, {
            qos,
            retain,
        });
    }
}
