import { SentenceId } from "../constants";
import parseTime from "../helpers/parseTime";
import UbloxMessage from "./UbloxMessage";

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
export default class UbloxGrsMessage extends UbloxMessage<SentenceId.GRS> {
    static readonly sentenceId = SentenceId.GRS;
    static readonly sentenceName = "GNSS range residuals";
    static readonly cid = 0xf0;
    static readonly mid = 0x06;

    protected static parse(fields: string[]): object {
        return {
            time: parseTime(fields[1]),
            mode: fields[2],
            residual: fields.slice(3, 15),
            systemId: fields[15],
            signalId: fields[16],
        };
    }
}

UbloxMessage.registerClass(UbloxGrsMessage);
