import mqtt, { IClientPublishOptions } from "mqtt";
import { PluginConfig, typeFromMessage } from "../helpers/config";
import UbloxMessage from "../messages/UbloxMessage";
import UbloxReaderPlugin from "./UbloxReaderPlugin";

export interface UbloxReaderMqttPluginConfig extends PluginConfig {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    topic?: string;
    qos?: IClientPublishOptions["qos"];
    retain?: boolean;
}

enum Status {
    online = "online",
    offline = "offline",
}

export default class UbloxReaderMqttPlugin extends UbloxReaderPlugin<UbloxReaderMqttPluginConfig> {
    readonly name = "mqtt";
    protected client: mqtt.MqttClient | undefined;

    // set config defaults
    readConfig() {
        return {
            host: "localhost",
            port: 1883,
            topic: "ublox",
            ...super.readConfig(),
        };
    }

    setup() {
        // setup MQTT client
        const { host, port, username, password, topic } = this.config;
        console.log(`Connecting to MQTT broker at ${host}:${port}`);
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
        client.on("error", (error) => {
            console.error(`MQTT error: ${error as Error}`);
        });
        client.on("connect", () => {
            client?.publish(`${topic}/status`, Status.online, {
                retain: true,
            });
        });

        // bind event handlers
        this.device.on("message", this.handleMessage.bind(this));
    }

    teardown(): void {
        this.client?.publish(`${this.config.topic}/status`, Status.offline, {
            retain: true,
        });
        console.log("Disconnecting from MQTT broker");
        this.client?.end();
    }

    protected topicForMessage(message: UbloxMessage): string {
        const suffix = typeFromMessage(message);
        return `${this.config.topic}/message/${suffix}`;
    }

    handleMessage(message: UbloxMessage) {
        if (!this.includesMessage(message)) return;

        const { qos, retain } = this.config;
        const topic = this.topicForMessage(message);
        const payload = JSON.stringify(message);
        this.client?.publish(topic, payload, {
            qos,
            retain,
        });
    }
}
