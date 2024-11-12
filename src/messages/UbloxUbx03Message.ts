import { SentenceId } from "../constants";
import parseFloatX from "../helpers/parseFloatX";
import parseIntX from "../helpers/parseIntX";
import UbloxMessage from "./UbloxMessage";

class Satellite {
    constructor(
        public readonly satelliteId: string,
        public readonly satelliteType: string,
        public readonly status: string,
        public readonly azimuth: number,
        public readonly elevation: number,
        public readonly signalStrength: number,
        public readonly carrierLockTime: number
    ) {}
}

export interface UbloxUbx03MessageData {
    satellites: Satellite[];
}

/**
 * Get satellite type
 */
function getSatelliteType(satId: string): string {
    const id = parseInt(satId, 10);
    if (id < 33) {
        return "GPS";
    } else if (id < 65) {
        // indicates SBAS: WAAS, EGNOS, MSAS, etc.
        return "SBAS";
    } else if (id < 97) {
        // GLONASS
        return "GLONASS";
    } else if (id >= 120 && id < 162) {
        // indicates SBAS: WAAS, EGNOS, MSAS, etc.
        return "SBAS";
    } else if (id > 210) {
        return "GALILEO";
    }
    return "UNKNOWN";
}

/**
 * # `UBX03` - Satellite status
 */
export default class UbloxUbx03Message extends UbloxMessage<
    SentenceId.UBX03,
    UbloxUbx03MessageData
> {
    static readonly sentenceId = SentenceId.UBX03;
    static readonly sentenceName = "Satellite status";
    static readonly cid = 0xf1;
    static readonly mid = 0x03;

    protected static parse(fields: string[]): UbloxUbx03MessageData {
        const satellites = [];
        const satCount = parseFloatX(fields[2]);
        let offset = 3;
        for (let i = 0; i < satCount; i++) {
            const satId = fields[offset];
            satellites.push(
                new Satellite(
                    satId,
                    getSatelliteType(satId),
                    fields[offset + 1],
                    parseIntX(fields[offset + 2]),
                    parseIntX(fields[offset + 3]),
                    parseIntX(fields[offset + 4]),
                    parseIntX(fields[offset + 5])
                )
            );
            offset += 6;
        }
        return { satellites };
    }
}

UbloxMessage.registerClass(UbloxUbx03Message);
