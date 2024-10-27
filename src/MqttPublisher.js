import mqtt from "mqtt";

/**
 * The status of the GPS device
 * @enum {string}
 * @readonly
 */
const Status = {
    online: "online",
    offline: "offline",
};

export default class MqttPublisher {
    /**
     * @param {mqtt.IClientOptions} options
     * @param {string} topic
     */
    constructor(options, topic) {
        /** @type {string} */
        this.topic = topic;
        /** @type {mqtt.MqttClient} */
        this.client = mqtt.connect({
            ...options,
            will: {
                topic: `${topic}/status`,
                payload: Status.offline,
                retain: true,
            },
        });
        this.client.on("connect", this.handleConnect.bind(this));
        this.client.on("error", this.handleError.bind(this));
    }

    /**
     * Publish a message to the MQTT broker
     * @param {string} suffix The suffix to append to the topic
     * @param {string} message The message to publish
     * @returns {this}
     * @protected
     */
    publish(suffix, message) {
        this.client.publish(`${this.topic}/${suffix}`, message);
        return this;
    }

    /**
     * Publish a JSON message to the MQTT broker
     * @param {string} suffix The suffix to append to the topic
     * @param {any} data The data to publish
     * @returns {this}
     * @protected
     */
    publishJson(suffix, data) {
        return this.publish(suffix, JSON.stringify(data));
    }

    /**
     * Handle the connection to the MQTT broker
     * @protected
     */
    handleConnect() {
        console.log("Connected to MQTT");
        this.publish("status", Status.online);
    }

    /**
     * Handle the error from the MQTT broker
     * @protected
     */
    handleError(error) {
        console.error(`Error from MQTT: ${error}`);
    }

    /**
     * Handle an incoming message from the device
     * @param {import("./messages/UbloxMessage").default} message The message from the device
     * @protected
     */
    handleMessage(message) {
        this.publishJson(`message/${message.sentenceId.toLowerCase()}`, message);
    }

    /**
     * Attach the device to the publisher
     * @param {import("./UbloxDevice").default} device The device to attach
     * @param {string[]} [messageTypes] The message types to listen for from the device
     * @returns {MqttPublisher} The publisher
     */
    attach(device, messageTypes) {
        if (!messageTypes) {
            device.on("message", this.handleMessage.bind(this));
        } else {
            messageTypes.forEach((messageType) => {
                device.onMessageOfType(
                    messageType,
                    this.handleMessage.bind(this, messageType)
                );
            });
        }
        return this;
    }
}
