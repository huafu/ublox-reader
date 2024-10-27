import { connect, IClientOptions, IClientPublishOptions } from "mqtt";
import UbloxMessage from "./messages/UbloxMessage";
import UbloxDevice from "./UbloxDevice";
import { SentenceId } from "./constants";

/**
 * The status of the GPS device
 */
enum Status {
    online = "online",
    offline = "offline",
}

export default class MqttPublisher {
    protected client: ReturnType<typeof connect>;
    constructor(options: IClientOptions, readonly topic: string) {
        this.client = connect({
            ...options,
            will: {
                topic: this.fullTopic("status"),
                payload: Status.offline as unknown as Buffer,
                retain: true,
            },
        } satisfies IClientOptions);
        this.client.on("connect", this.handleConnect.bind(this));
        this.client.on("reconnect", this.handleConnect.bind(this));
        this.client.on("error", this.handleError.bind(this));
    }

    /**
     * Get the full topic for the MQTT publisher
     * @param suffix The suffix to append to the topic
     */
    protected fullTopic(suffix: string): string {
        return `${this.topic}/${suffix}`;
    }

    /**
     * Publish a message to the MQTT broker
     * @param suffix The suffix to append to the topic
     * @param message The message to publish
     * @param opt The options for the publish
     */
    protected publish(
        suffix: string,
        message: string,
        opt?: IClientPublishOptions
    ) {
        this.client.publish(this.fullTopic(suffix), message, opt);
        return this;
    }

    /**
     * Publish a JSON message to the MQTT broker
     * @param suffix The suffix to append to the topic
     * @param data The data to publish
     * @param opt The options for the publish
     */
    protected publishJson(
        suffix: string,
        data: unknown,
        opt?: IClientPublishOptions
    ) {
        return this.publish(suffix, JSON.stringify(data), opt);
    }

    /**
     * Handle the connection to the MQTT broker
     */
    protected handleConnect() {
        console.log("Connected to MQTT");
        this.publish("status", Status.online, { retain: true });
    }

    /**
     * Handle the error from the MQTT broker
     */
    protected handleError(error: Error) {
        console.error(`Error from MQTT: ${error}`);
    }

    /**
     * Handle an incoming message from the device
     */
    protected handleMessage(message: UbloxMessage) {
        this.publishJson(
            `message/${message.sentenceId.toLowerCase()}`,
            message
        );
    }

    /**
     * Attach the device to the publisher
     * @param device The device to attach
     * @param The message types to listen for from the device
     */
    attach(device: UbloxDevice, messageTypes?: SentenceId[]): this {
        if (!messageTypes) {
            device.on("message", this.handleMessage.bind(this));
        } else {
            messageTypes.forEach((messageType) => {
                device.onMessageOfType(
                    messageType,
                    this.handleMessage.bind(this)
                );
            });
        }
        return this;
    }
}
