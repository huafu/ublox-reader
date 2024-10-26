import { SerialPort } from "serialport";
import deviceInfoFromPort from "./deviceInfoFromPort.js";

/**
 * List all serial u-blox devices connected to the computer
 * @returns {Promise<import("./constants").DeviceInfo[]>}
 */
export default async function findSerialDevices() {
    const devices = await SerialPort.list();
    return devices.map(deviceInfoFromPort).filter((x) => !!x);
}
