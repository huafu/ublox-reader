import { ProductId } from "./constants.js";

const map = {
    "01a4": ProductId.Antaris4,
    "01a5": ProductId.uBlox5,
    "01a6": ProductId.uBlox6,
    "01a7": ProductId.uBlox7,
    "01a8": ProductId.uBlox8,
};

/**
 * Get the u-blox product ID from the USB product ID
 * @param {string} usbProductId - The USB product ID
 * @returns {ProductId} The u-blox product ID
 */
export default function ubloxProductId(usbProductId) {
    return map[usbProductId.toLowerCase()];
}
