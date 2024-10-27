import EventEmitter from "node:events";
import { SerialPort } from "serialport";
import SerialConfigurator from "./SerialConfigurator.js";
import { NavRate } from "./helpers/constants.js";
import UbloxMessage from "./messages/UbloxMessage.js";
import sentenceToMessage from "./helpers/sentenceToMessage.js";

const Defaults = {
    baudRate: 9600,
    navRate: NavRate.one,
};

const DeviceState = {
    disconnected: "disconnected",
    connecting: "connecting",
    connected: "connected",
};

/**
 * @typedef {{
 *     'message': [import("./messages/UbloxMessage.js").default],
 *     'message:dtm': [import("./messages/UbloxDtmMessage.js").default],
 *     'message:gbs': [import("./messages/UbloxGbsMessage.js").default],
 *     'message:gga': [import("./messages/UbloxGgaMessage.js").default],
 *     'message:gll': [import("./messages/UbloxGllMessage.js").default],
 *     'message:gns': [import("./messages/UbloxGnsMessage.js").default],
 *     'message:grs': [import("./messages/UbloxGrsMessage.js").default],
 *     'message:gsa': [import("./messages/UbloxGsaMessage.js").default],
 *     'message:gst': [import("./messages/UbloxGstMessage.js").default],
 *     'message:gsv': [import("./messages/UbloxGsvMessage.js").default],
 *     'message:rmc': [import("./messages/UbloxRmcMessage.js").default],
 *     'message:ths': [import("./messages/UbloxThsMessage.js").default],
 *     'message:txt': [import("./messages/UbloxTxtMessage.js").default],
 *     'message:ubx00': [import("./messages/UbloxUbx00Message.js").default],
 *     'message:ubx03': [import("./messages/UbloxUbx03Message.js").default],
 *     'message:ubx04': [import("./messages/UbloxUbx04Message.js").default],
 *     'message:vlw': [import("./messages/UbloxVlwMessage.js").default],
 *     'message:vtg': [import("./messages/UbloxVtgMessage.js").default],
 *     'message:zda': [import("./messages/UbloxZdaMessage.js").default],
 * }} UbloxDeviceEventMap
 */

/**
 * Convert a sentence ID to an event name
 * @param {import("./helpers/constants.js").SentenceId} sentenceId The sentence ID
 * @returns {string} The event name
 */
function sentenceIdToEvent(sentenceId) {
    return `message:${sentenceId.toLowerCase()}`;
}

/**
 * Class representing a Ublox device
 * @extends EventEmitter<UbloxDeviceEventMap>
 */
export default class UbloxDevice extends EventEmitter {
    /**
     * @param {import("./helpers/constants.js").DeviceInfo} device
     * @param {Object} [options]
     * @param {number} [options.baudRate]
     * @param {import("./helpers/constants.js").NavRate} [options.navRate]
     */
    constructor(
        device,
        { baudRate = Defaults.baudRate, navRate = Defaults.navRate } = {}
    ) {
        super();
        /** @type {boolean} */
        this.isConnectionWanted = false;
        /** @type {import("./helpers/constants.js").DeviceInfo} */
        this.device = device;
        /** @type {number} */
        this.baudRate = baudRate;
        /** @type {import("./helpers/constants.js").NavRate} */
        this.navRate = navRate;

        /** @type {SerialPort} */
        this.port = new SerialPort({
            path: device.path,
            baudRate: baudRate,
            autoOpen: false,
        });
        /** @type {SerialConfigurator} */
        this.configurator = new SerialConfigurator(this.port);
        /** @type {DeviceState} */
        this.state = DeviceState.disconnected;
        this.port.on("open", this.handleOpen.bind(this));
        this.port.on("readable", this.handleReadable.bind(this));
        this.port.on("close", this.handleClose.bind(this));
        this.port.on("error", this.handleError.bind(this));
    }

    /**
     * Connect the device
     */
    connect() {
        this.isConnectionWanted = true;
        this.connectIfWanted();
    }

    /**
     * Connect the device if the connection is wanted
     * @private
     */
    connectIfWanted() {
        if (!this.isConnectionWanted) return;
        if (this.state !== DeviceState.disconnected) return;
        try {
            this.port.open();
            this.state = DeviceState.connecting;
        } catch (error) {
            console.error(
                `Error opening ${this.device.path}: ${error.message}`
            );
            this.connectionLoop();
        }
    }

    /**
     * Disconnect the device
     */
    disconnect() {
        this.isConnectionWanted = false;
        if (this.state === DeviceState.disconnected) return;
        this.port.close();
    }

    /**
     * Run when the serial port has an error
     * @private
     */
    handleError(error) {
        console.error(`Error on ${this.device.path}: ${error.message}`);
    }

    /**
     * Run when the serial port is opened
     * @private
     */
    handleOpen() {
        this.state = DeviceState.connected;
        this.configurator.setupDevice(this.device.pid);
        UbloxMessage.Classes.forEach((MsgClass) => {
            this.configurator.enableMessages(MsgClass);
        });
        this.configurator.setNavRate(this.navRate);
    }

    /**
     * Read incoming data from the serial port
     * @private
     */
    handleReadable() {
        const buffer = this.port.read();
        if (!buffer) return;

        const [hdr0, hdr1] = buffer;

        if (hdr0 !== 0x24 || !(hdr1 === 0x47 || hdr1 === 0x50)) return;

        // we have a NMEA message, read to CRLF
        let msg = [];
        const lines = [];
        for (let x = 0; x < buffer.length; x++) {
            msg.push(buffer[x]);
            if (buffer[x] === 0x0d && buffer[x + 1] === 0x0a) {
                lines.push(Buffer.from(msg).toString());
                msg = [];
            }
        }

        // Parse each line and emit the message
        lines.forEach((line) => {
            const message = sentenceToMessage(line);
            if (!message) return;
            this.emit("message", message);
            this.emit(sentenceIdToEvent(message.sentenceId), message);
        });
    }

    /**
     * Listen for a message of a specific type
     * @param {import("./helpers/constants.js").SentenceId} sentenceId The sentence ID
     * @param {(UbloxMessage) => void} listener The listener
     * @returns {this}
     */
    onMessageOfType(sentenceId, listener) {
        return this.on(sentenceIdToEvent(sentenceId), listener);
    }

    /**
     * Run when the serial port is closed
     * @private
     */
    handleClose() {
        this.state = DeviceState.disconnected;
        this.connectionLoop();
    }

    /**
     * Run the connection loop
     * @private
     */
    connectionLoop() {
        if (
            this.isConnectionWanted &&
            this.state === DeviceState.disconnected
        ) {
            setTimeout(() => this.connectIfWanted(), 3000);
        }
    }
}
