import { SentenceId } from "../constants";
import parseFloatX from "../helpers/parseFloatX";
import UbloxMessage from "./UbloxMessage";

const StatusMap = {
    A: "Autonomous",
    E: "Estimated",
    M: "Manual input",
    S: "Simulator",
    V: "Data not valid",
} as const;

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
export default class UbloxThsMessage extends UbloxMessage<SentenceId.THS> {
    static readonly sentenceId = SentenceId.THS;
    static readonly sentenceName = "True heading and status";
    static readonly cid = 0xf0;
    static readonly mid = 0x0e;

    protected static parse(fields: string[]): object {
        return {
            headt: parseFloatX(fields[1]),
            mi: fields[2],
            miStr: StatusMap[fields[2] as keyof typeof StatusMap],
        };
    }
}

UbloxMessage.registerClass(UbloxThsMessage);
