import { SentenceId } from "../helpers/constants.js";
import parseFloatX from "../helpers/parseFloatX.js";
import UbloxMessage from "./UbloxMessage.js";

/**
 * # `VLW` – Dual ground/water distance
 *
 * ```txt
 *        1   2 3   4 5   6 7   8 9
 *        |   | |   | |   | |   | |
 * $--VHW,x.x,T,x.x,M,x.x,N,x.x,K*hh<CR><LF>
 * ```
 *
 * Field Number:
 * 1. Degrees True
 * 2. T = True
 * 3. Degrees Magnetic
 * 4. M = Magnetic
 * 5. Knots (speed of vessel relative to the water)
 * 6. N = Knots
 * 7. Kilometers (speed of vessel relative to the water)
 * 8. K = Kilometers
 * 9. Checksum
 */
export default class UbloxVlwMessage extends UbloxMessage {
    static sentenceId = SentenceId.VLW;
    static sentenceName = "Dual ground/water distance";
    static cid = 0xf0;
    static mid = 0x0f;

    static parse(fields) {
        return {
            twd: parseFloatX(fields[1]),
            twdUnit: fields[2],
            wd: parseFloatX(fields[3]),
            wdUnit: fields[4],
            tgd: parseFloatX(fields[5]),
            tgdUnit: fields[6],
            gd: parseFloatX(fields[7]),
            gdUnit: fields[8],
        };
    }
}

UbloxMessage.registerClass(UbloxVlwMessage);
