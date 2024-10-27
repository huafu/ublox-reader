import { SentenceId } from "../helpers/constants.js";
import parseFloatX from "../helpers/parseFloatX.js";
import parseIntX from "../helpers/parseIntX.js";
import UbloxMessage from "./UbloxMessage.js";

class Satellite {
    constructor(sid, typ, stat, azi, elev, sig, clt) {
        this.satelliteId = sid;
        this.satelliteType = typ;
        this.status = stat;
        this.azimuth = azi;
        this.elevation = elev;
        this.signalStrength = sig;
        this.carrierLockTime = clt;
    }
}

/**
 * Get satellite type
 * @param {number} id
 * @returns {string}
 */
function getSatelliteType(id) {
    let type = "";
    if (id < 33) {
        type = "GPS";
    } else if (id < 65) {
        // indicates SBAS: WAAS, EGNOS, MSAS, etc.
        type = "SBAS";
    } else if (id < 97) {
        // GLONASS
        type = "GLONASS";
    } else if (id >= 120 && id < 162) {
        // indicates SBAS: WAAS, EGNOS, MSAS, etc.
        type = "SBAS";
    } else if (id > 210) {
        type = "GALILEO";
    } else {
        type = "UNKNOWN";
    }
    return type;
}

/**
 * # `UBX03` - Satellite status
 */
export default class UbloxUbx03Message extends UbloxMessage {
    static sentenceId = SentenceId.UBX03;
    static sentenceName = "Satellite status";
    static cid = 0xf1;
    static mid = 0x03;

    static parse(fields) {
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
