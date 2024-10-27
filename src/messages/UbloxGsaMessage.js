import { SentenceId } from "../helpers/constants.js";
import parseFloatX from "../helpers/parseFloatX.js";
import parseIntX from "../helpers/parseIntX.js";
import UbloxMessage from "./UbloxMessage.js";

const ThreeDFixTypes = ["unknown", "none", "2D", "3D"];

/**
 * # `GSA` - Active satellites and dilution of precision
 *
 * ```txt
 *         1 2 3  4  5  6  7  8  9  10 11 12 13 14 15  16  17  18
 *         | | |  |  |  |  |  |  |  |  |  |  |  |  |   |   |   |
 *  $--GSA,a,x,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,x.x,x.x,x.x*hh<CR><LF>
 * ```
 *
 * Field Number:
 * 1. Selection of 2D or 3D fix
 *     - `A` - Automatic
 *     - `M` - Manual, forced to operate in 2D or 3D
 * 2. 3D fix
 *     - `1` - no fix
 *     - `2` - 2D fix
 *     - `3` - 3D fix
 * 3. PRN of satellite used for fix (may be blank)
 * ...
 * 14. PRN of satellite used for fix (may be blank)
 * 15. Dilution of precision
 * 16. Horizontal dilution of precision
 * 17. Vertical dilution of precision
 * 18. Checksum
 */
export default class UbloxGsaMessage extends UbloxMessage {
    static sentenceId = SentenceId.GSA;
    static sentenceName = "Active satellites and dilution of precision";
    static cid = 0xf0;
    static mid = 0x02;

    static parse(fields) {
        const fix = parseIntX(fields[2]);
        return {
            selection: fields[1],
            selectionStr: fields[1] === "A" ? "automatic" : "manual",
            fix,
            fixStr: ThreeDFixTypes[fix],
            satellites: fields.slice(3, 15).filter((x) => x.length > 0),
            PDOP: parseFloatX(fields[15]),
            HDOP: parseFloatX(fields[16]),
            VDOP: parseFloatX(fields[17]),
        };
    }
}

UbloxMessage.registerClass(UbloxGsaMessage);
