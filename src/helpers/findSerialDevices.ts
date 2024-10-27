import { SerialPort } from "serialport";
import deviceInfoFromPort from "./deviceInfoFromPort";
import { DeviceInfo } from "../UbloxDevice";

/**
 * List all serial u-blox devices connected to the computer
 */
export default async function findSerialDevices(): Promise<DeviceInfo[]> {
    const devices = await SerialPort.list();
    return devices.map(deviceInfoFromPort).filter((x: DeviceInfo | undefined) => !!x);
}
