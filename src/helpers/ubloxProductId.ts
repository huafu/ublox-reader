import { ProductId } from "../constants";

const map = {
    "01a4": ProductId.Antaris4,
    "01a5": ProductId.uBlox5,
    "01a6": ProductId.uBlox6,
    "01a7": ProductId.uBlox7,
    "01a8": ProductId.uBlox8,
} as const;

/**
 * Get the u-blox product ID from the USB product ID
 * @param usbProductId - The USB product ID
 * @returns The u-blox product ID
 */
export default function ubloxProductId(
    usbProductId: string
): ProductId | undefined {
    const key = usbProductId.toLowerCase() as keyof typeof map;
    return map[key];
}
