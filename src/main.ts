import { config } from "dotenv";
import UbloxDevice from "./UbloxDevice";
import findSerialDevices from "./helpers/findSerialDevices";
import exitHook from "exit-hook";
import MqttPublisher from "./MqttPublisher";
import { NavRate, ProductId, SentenceId } from "./constants";
import UbloxMessage from "./messages/UbloxMessage";

config();

async function main() {
    const { MESSAGES, DEVICE, BAUD_RATE, NAV_RATE } = process.env;

    const baudRate = (BAUD_RATE && parseInt(BAUD_RATE, 10)) || undefined;
    const navRate =
        ((NAV_RATE && parseInt(NAV_RATE, 10)) as NavRate) || undefined;

    // get the device
    let device: UbloxDevice;
    if (DEVICE) {
        const [pid, path] = DEVICE.split(":").map((s) => s.trim()) as [
            ProductId,
            string
        ];
        device = new UbloxDevice(
            { path, pid },
            {
                baudRate,
                navRate,
            }
        );
    } else {
        const devices = await findSerialDevices();
        if (devices.length === 0) {
            console.error("No serial devices found");
            process.exit(1);
        }
        // take the first device found
        device = new UbloxDevice(devices[0], {
            baudRate,
            navRate,
        });
    }

    // exit cleanly
    exitHook(() => {
        device.disconnect();
    });

    // handle messages
    const onMessage = (message: UbloxMessage) => {
        console.log(JSON.stringify(message));
    };

    // set up the device
    if (MESSAGES) {
        MESSAGES.trim()
            .split(/\s*,\s*/g)
            .map((sid) => device.onMessageOfType(sid as SentenceId, onMessage));
    } else {
        device.on("message", onMessage);
    }

    // setup mqtt
    if (process.env.MQTT_HOST) {
        const {
            MQTT_HOST,
            MQTT_PORT,
            MQTT_TOPIC,
            MQTT_USERNAME,
            MQTT_PASSWORD,
            // MQTT_RETAIN,
            // MQTT_QOS,
        } = process.env;
        const options = {
            host: MQTT_HOST,
            port: (MQTT_PORT && parseInt(MQTT_PORT, 10)) || 1883,
            username: MQTT_USERNAME,
            password: MQTT_PASSWORD,
        };
        const topic = MQTT_TOPIC ?? "ublox";
        const mqtt = new MqttPublisher(options, topic);
        mqtt.attach(device);
    }

    // connect the device
    device.connect();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
