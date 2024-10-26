import { SentenceId } from "../helpers/constants.js";
import parseIntX from "../helpers/parseIntX.js";
import parseTime from "../helpers/parseTime.js";
import UbloxMessage from "./UbloxMessage.js";

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
export default class UbloxZdaMessage extends UbloxMessage {
    static sentenceId = SentenceId.ZDA;
    static sentenceName = "UTC, day, month, year, and local time zone";
    static cid = 0xf0;
    static mid = 0x08;

    static parse(fields) {
        return {
            datetime: parseTime(fields[1], ""),
            localZoneHours: parseIntX(fields[5]),
            localZoneMinutes: parseIntX(fields[6]),
        };
    }
}

UbloxMessage.registerClass(UbloxZdaMessage);
