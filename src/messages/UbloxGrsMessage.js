import { SentenceId } from "../helpers/constants.js";
import parseTime from "../helpers/parseTime.js";
import UbloxMessage from "./UbloxMessage.js";

/**
 * # `GRS` - GNSS range residuals
 *
 * ```txt
 *                    [1   2   3   4   5   6   7   8   9  10  11  12]
 *        1         2  3   4   5   6   7   8   9  10  11  12  13  14  15 16  17
 *        |         |  |   |   |   |   |   |   |   |   |   |   |   |  |  |   |
 * $--GRS,hhmmss.ss,x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,hh,hh,*hh<CR><LF>
 * ```
 *
 * Field Number:
 * 1. Time (UTC)
 * 2. Mode
 * 3. Residual (3 - 14, 12 fields, matching order of GSA sentence)
 * 15. `systemId`
 * 16. `signalId`
 * 17. Checksum
 */
export default class UbloxGrsMessage extends UbloxMessage {
    static sentenceId = SentenceId.GRS;
    static sentenceName = "GNSS range residuals";
    static cid = 0xf0;
    static mid = 0x06;

    static parse(fields) {
        return {
            time: parseTime(fields[1], ""),
            mode: fields[2],
            residual: fields.slice(3, 15),
            systemId: fields[15],
            signalId: fields[16],
        };
    }
}

UbloxMessage.registerClass(UbloxGrsMessage);
