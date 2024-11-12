import { SentenceId } from "../constants";
import parseDateTime from "../helpers/parseDateTime";
import parseIntX from "../helpers/parseIntX";
import UbloxMessage from "./UbloxMessage";

export interface UbloxUbx04MessageData {
    utcDateTime: Date;
    utcTow: number;
    utcWeek: number;
    leapSec: number;
    clkBias: number;
    clkDrift: number;
    tpGranularity: number;
}

/**
 * # `UBX04` - Time of day and clock information
 *
 * ```txt
 *       1         2      3      4      5  6     7       8       9    10
 *       |         |      |      |      |  |     |       |       |     |
 *  $--UBX04,hhmmss.ss,ddmmyy,hhmmss.ss,ww,ls,clkBias,clkDrift,tpGran,*hh<CR><LF>
 *
 * Field Number:
 *
 * 1. Proprietary message identifier: 04
 * 2. UTC Time
 * 3. UTC Date
 * 4. UTC time of week
 * 5. UTC week number, continues beyond 1023
 * 6. Leap seconds
 * 7. Receiver clock bias
 * 8. Receiver clock drift
 * 9. Time pulse granularity
 * 10. Checksum
 */
export default class UbloxUbx04Message extends UbloxMessage<
    SentenceId.UBX04,
    UbloxUbx04MessageData
> {
    static readonly sentenceId = SentenceId.UBX04;
    static readonly sentenceName = "Time of day and clock information";
    static readonly cid = 0xf1;
    static readonly mid = 0x04;

    protected static parse(fields: string[]): UbloxUbx04MessageData {
        return {
            utcDateTime: parseDateTime(fields[3], fields[2]),
            utcTow: parseIntX(fields[4]),
            utcWeek: parseIntX(fields[5]),
            leapSec: parseIntX(fields[6]),
            clkBias: parseIntX(fields[7]),
            clkDrift: parseIntX(fields[8]),
            tpGranularity: parseIntX(fields[9]),
        };
    }
}

UbloxMessage.registerClass(UbloxUbx04Message);
