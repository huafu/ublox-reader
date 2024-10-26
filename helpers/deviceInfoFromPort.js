import ubloxProductId from "./ubloxProductId.js";

/**
 * Get the device information from the port object
 * @param {import("serialport").SerialPort} port The port object
 * @returns {import("./constants").DeviceInfo} The device information
 */
export default function deviceInfoFromPort(port) {
    if (port.vendorId !== "1546") return undefined;
    const pid = ubloxProductId(port.productId);
    if (!pid) return undefined;
    return {
        path: port.path,
        pid: pid,
    };
}
