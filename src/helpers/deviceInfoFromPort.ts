import { DeviceInfo } from "../UbloxDevice";
import ubloxProductId from "./ubloxProductId";
import { SerialPort } from "serialport";

type PortInfo = ReturnType<typeof SerialPort.list> extends Promise<
    Array<infer T>
>
    ? T
    : never;

/**
 * Get the device information from the port object
 * @param port The port object
 * @returns The device information
 */
export default function deviceInfoFromPort(
    port: PortInfo
): DeviceInfo | undefined {
    if (port.vendorId !== "1546" || !port.productId) return;
    const pid = ubloxProductId(port.productId);
    if (!pid) return;
    return {
        path: port.path,
        pid: pid,
    };
}
