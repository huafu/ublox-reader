import EventEmitter from "node:events";
import { SerialPort } from "serialport";
import UbloxMessage from "./messages/UbloxMessage";
import sentenceToMessage from "./helpers/sentenceToMessage";
import { NavRate, ProductId, SentenceId } from "./constants";
import UbloxDtmMessage from "./messages/UbloxDtmMessage";
import UbloxGbsMessage from "./messages/UbloxGbsMessage";
import UbloxGgaMessage from "./messages/UbloxGgaMessage";
import UbloxGllMessage from "./messages/UbloxGllMessage";
import UbloxGnsMessage from "./messages/UbloxGnsMessage";
import UbloxGrsMessage from "./messages/UbloxGrsMessage";
import UbloxGsaMessage from "./messages/UbloxGsaMessage";
import UbloxGstMessage from "./messages/UbloxGstMessage";
import UbloxGsvMessage from "./messages/UbloxGsvMessage";
import UbloxRmcMessage from "./messages/UbloxRmcMessage";
import UbloxThsMessage from "./messages/UbloxThsMessage";
import UbloxTxtMessage from "./messages/UbloxTxtMessage";
import UbloxUbx00Message from "./messages/UbloxUbx00Message";
import UbloxUbx03Message from "./messages/UbloxUbx03Message";
import UbloxUbx04Message from "./messages/UbloxUbx04Message";
import UbloxVlwMessage from "./messages/UbloxVlwMessage";
import UbloxVtgMessage from "./messages/UbloxVtgMessage";
import UbloxZdaMessage from "./messages/UbloxZdaMessage";
import SerialConfigurator from "./SerialConfigurator";

export interface DeviceInfo {
    path: string;
    pid: ProductId;
}

const Defaults = {
    baudRate: 9600,
    navRate: NavRate.one,
} as const;

export enum DeviceState {
    disconnected = "disconnected",
    connecting = "connecting",
    connected = "connected",
}

interface UbloxDeviceEventMap {
    connected: [];
    disconnected: [];
    message: [UbloxMessage];
    "message:dtm": [UbloxDtmMessage];
    "message:gbs": [UbloxGbsMessage];
    "message:gga": [UbloxGgaMessage];
    "message:gll": [UbloxGllMessage];
    "message:gns": [UbloxGnsMessage];
    "message:grs": [UbloxGrsMessage];
    "message:gsa": [UbloxGsaMessage];
    "message:gst": [UbloxGstMessage];
    "message:gsv": [UbloxGsvMessage];
    "message:rmc": [UbloxRmcMessage];
    "message:ths": [UbloxThsMessage];
    "message:txt": [UbloxTxtMessage];
    "message:ubx00": [UbloxUbx00Message];
    "message:ubx03": [UbloxUbx03Message];
    "message:ubx04": [UbloxUbx04Message];
    "message:vlw": [UbloxVlwMessage];
    "message:vtg": [UbloxVtgMessage];
    "message:zda": [UbloxZdaMessage];
}

/**
 * Convert a sentence ID to an event name
 * @param sentenceId The sentence ID
 * @returns The event name
 */
function sentenceIdToEvent(sentenceId: SentenceId): keyof UbloxDeviceEventMap {
    return `message:${sentenceId.toLowerCase() as Lowercase<SentenceId>}`;
}

interface UbloxDeviceCtorOptions {
    baudRate?: number;
    navRate?: NavRate;
}

/**
 * Class representing a Ublox device
 */
export default class UbloxDevice extends EventEmitter<UbloxDeviceEventMap> {
    protected isConnectionWanted: boolean;
    readonly device: DeviceInfo;
    protected baudRate: number;
    protected navRate: NavRate;
    protected port: SerialPort;
    protected configurator: SerialConfigurator;
    protected state: DeviceState;

    constructor(
        device: DeviceInfo,
        {
            baudRate = Defaults.baudRate,
            navRate = Defaults.navRate,
        }: UbloxDeviceCtorOptions = {}
    ) {
        super();
        this.isConnectionWanted = false;
        this.device = device;
        this.baudRate = baudRate;
        this.navRate = navRate;

        this.port = new SerialPort({
            path: device.path,
            baudRate: baudRate,
            autoOpen: false,
        });

        this.configurator = new SerialConfigurator(this.port);
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
     */
    protected connectIfWanted() {
        if (!this.isConnectionWanted) return;
        if (this.state !== DeviceState.disconnected) return;
        try {
            this.port.open();
            this.state = DeviceState.connecting;
            this.emit("connected");
        } catch (error) {
            console.error(
                `Error opening ${this.device.path}: ${error as Error}`
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
        this.emit("disconnected");
    }

    /**
     * Run when the serial port has an error
     */
    protected handleError(error: Error) {
        console.error(`Error on ${this.device.path}: ${error}`);
    }

    /**
     * Run when the serial port is opened
     */
    protected handleOpen() {
        this.state = DeviceState.connected;
        this.configurator.setupDevice(this.device.pid);
        UbloxMessage.Classes.forEach((MsgClass) => {
            this.configurator.enableMessages(MsgClass);
        });
        this.configurator.setNavRate(this.navRate);
    }

    /**
     * Read incoming data from the serial port
     */
    protected handleReadable() {
        const buffer = this.port.read() as Buffer | null;
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
     */
    onMessageOfType(
        sentenceId: SentenceId,
        listener: (message: UbloxMessage) => void
    ) {
        return this.on(sentenceIdToEvent(sentenceId), listener);
    }

    /**
     * Run when the serial port is closed
     */
    protected handleClose() {
        this.state = DeviceState.disconnected;
        this.connectionLoop();
    }

    /**
     * Run the connection loop
     */
    protected connectionLoop() {
        if (
            this.isConnectionWanted &&
            this.state === DeviceState.disconnected
        ) {
            setTimeout(() => this.connectIfWanted(), 3000);
        }
    }
}
