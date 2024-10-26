import { SentenceId } from "../helpers/constants.js";
import parseFloatX from "../helpers/parseFloatX.js";
import UbloxMessage from "./UbloxMessage.js";

const StatusMap = {
    A: "Autonomous",
    E: "Estimated",
    M: "Manual input",
    S: "Simulator",
    V: "Data not valid",
};

/**
 * # `THS` - True heading and status
 *
 * ```txt
 *         1   2 3
 *         |   | |
 * $--THS,x.x,A*hh<CR><LF>
 * ```
 *
 * Field Number:
 * 1. Heading degrees true
 * 2. Status
 *     - `A` = Data Valid
 *     - `E` = Data Invalid
 *     - `M` = Manual input mode
 *     - `S` = Simulator mode
 *     - `V` = Data Invalid
 * 3. Checksum
 */
export default class UbloxThsMessage extends UbloxMessage {
    static sentenceId = SentenceId.THS;
    static sentenceName = "True heading and status";
    static cid = 0xf0;
    static mid = 0x0e;

    static parse(fields) {
        return {
            headt: parseFloatX(fields[1]),
            mi: fields[2],
            miStr: StatusMap[fields[2]],
        };
    }
}

UbloxMessage.registerClass(UbloxThsMessage);
