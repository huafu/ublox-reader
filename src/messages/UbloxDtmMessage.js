import { SentenceId } from "../helpers/constants.js";
import parseFloatX from "../helpers/parseFloatX.js";
import parseLatitude from "../helpers/parseLatitude.js";
import parseLongitude from "../helpers/parseLongitude.js";
import UbloxMessage from "./UbloxMessage.js";

/**
 * Parses the datum code
 * @param {string} field
 * @returns {string}
 */
function parseDatumCode(field) {
    return ["W84", "W72", "S85", "P90", "999"].includes(field) ? field : "";
}

/**
 * # `DTM` - Datum reference
 *
 * ```text
 *           1  2  3   4  5   6  7  8    9
 *           |  |  |   |  |   |  |  |    |
 *  $ --DTM,ref,x,llll,c,llll,c,aaa,ref*hh<CR><LF>
 * ```
 * Field Number:
 * 1. Local datum code.
 *     * `W84` - WGS84
 *     * `W72` - WGS72
 *     * `S85` - SGS85
 *     * `P90` - PE90
 *     * `999` - User defined IHO datum code
 * 2. Local datum subcode. May be blank.
 * 3. Latitude offset (minutes)
 * 4. `N` or `S`
 * 5. Longitude offset (minutes)
 * 6. `E` or `W`
 * 7. Altitude offset in meters
 * 8. Datum name. What’s usually seen here is `W84`, the standard WGS84 datum used by GPS.
 * 9. Checksum
 */
export default class UbloxDtmMessage extends UbloxMessage {
    static sentenceId = SentenceId.DTM;
    static sentenceName = "Datum reference";
    static cid = 0xf0;
    static mid = 0x06;

    static parse(fields) {
        return {
            datumCode: parseDatumCode(fields[1]),
            datumSubcode: fields[2],
            offsetLatitude: parseLatitude(fields[3], fields[4]),
            offsetLongitude: parseLongitude(fields[5], fields[6]),
            offsetAltitudeMeters: parseFloatX(fields[7]),
            datumName: parseDatumCode(fields[8]),
        };
    }
}

UbloxMessage.registerClass(UbloxDtmMessage);
