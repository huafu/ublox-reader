import { SentenceId } from "../constants";
import parseIntX from "../helpers/parseIntX";
import parseTime from "../helpers/parseTime";
import UbloxMessage from "./UbloxMessage";

/**
 * # `ZDA` - Time & Date - UTC, day, month, year and local time zone
 *
 * ```txt
 *	      1         2  3  4    5  6  7
 *        |         |  |  |    |  |  |
 * $--ZDA,hhmmss.ss,dd,mm,yyyy,zz,zz*hh<CR><LF>
 * ```
 *
 * Field Number:
 * 1. UTC time (hours, minutes, seconds, may have fractional subsecond)
 * 2. Day, 01 to 31
 * 3. Month, 01 to 12
 * 4. Year (4 digits)
 * 5. Local zone description, 00 to +- 13 hours
 * 6. Local zone minutes description, 00 to 59, apply same sign as local hours
 * 7. Checksum
 */
export default class UbloxZdaMessage extends UbloxMessage<SentenceId.ZDA> {
    static readonly sentenceId = SentenceId.ZDA;
    static readonly sentenceName = "UTC, day, month, year, and local time zone";
    static readonly cid = 0xf0;
    static readonly mid = 0x08;

    protected static parse(fields: string[]): object {
        return {
            datetime: parseTime(fields[1]),
            localZoneHours: parseIntX(fields[5]),
            localZoneMinutes: parseIntX(fields[6]),
        };
    }
}

UbloxMessage.registerClass(UbloxZdaMessage);
