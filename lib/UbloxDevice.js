import EventEmitter from "node:events";
import { SerialPort } from "serialport";
import SerialConfigurator from "./SerialConfigurator.js";
import { NavRate } from "../helpers/constants.js";
import UbloxMessage from "./UbloxMessage.js";
import sentenceToMessage from "../helpers/sentenceToMessage.js";

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
 *     'message': [import("./UbloxMessage").default],
 *     'message:dtm': [import("./UbloxDtmMessage").default],
 *     'message:gbs': [import("./UbloxGbsMessage").default],
 *     'message:gga': [import("./UbloxGgaMessage").default],
 *     'message:gll': [import("./UbloxGllMessage").default],
 *     'message:gns': [import("./UbloxGnsMessage").default],
 *     'message:grs': [import("./UbloxGrsMessage").default],
 *     'message:gsa': [import("./UbloxGsaMessage").default],
 *     'message:gst': [import("./UbloxGstMessage").default],
 *     'message:gsv': [import("./UbloxGsvMessage").default],
 *     'message:rmc': [import("./UbloxRmcMessage").default],
 *     'message:ths': [import("./UbloxThsMessage").default],
 *     'message:txt': [import("./UbloxTxtMessage").default],
 *     'message:ubx00': [import("./UbloxUbx00Message").default],
 *     'message:ubx03': [import("./UbloxUbx03Message").default],
 *     'message:ubx04': [import("./UbloxUbx04Message").default],
 *     'message:vlw': [import("./UbloxVlwMessage").default],
 *     'message:vtg': [import("./UbloxVtgMessage").default],
 *     'message:zda': [import("./UbloxZdaMessage").default],
 * }} UbloxDeviceEventMap
 */

/**
 * Class representing a Ublox device
 * @extends EventEmitter<UbloxDeviceEventMap>
 */
export default class UbloxDevice extends EventEmitter {
    /**
     * @param {import("../helpers/constants").DeviceInfo} device
     * @param {Object} [options]
     * @param {number} [options.baudRate]
     * @param {import("../helpers/constants").NavRate} [options.navRate]
     */
    constructor(
        device,
        { baudRate = Defaults.baudRate, navRate = Defaults.navRate } = {}
    ) {
        super();
        /** @type {boolean} */
        this.isConnectionWanted = false;
        /** @type {import("../helpers/constants").DeviceInfo} */
        this.device = device;
        /** @type {number} */
        this.baudRate = baudRate;
        /** @type {import("../helpers/constants").NavRate} */
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
        this.port.on("open", this.onOpen.bind(this));
        this.port.on("readable", this.onReadable.bind(this));
        this.port.on("close", this.onClose.bind(this));
        this.port.on("error", this.onError.bind(this));
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
    onError(error) {
        console.error(`Error on ${this.device.path}: ${error.message}`);
    }

    /**
     * Run when the serial port is opened
     * @private
     */
    onOpen() {
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
    onReadable() {
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
            this.emit(`message:${message.sentenceId.toLowerCase()}`, message);
        });
    }

    /**
     * Run when the serial port is closed
     * @private
     */
    onClose() {
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
