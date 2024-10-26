import { SentenceId } from "../helpers/constants.js";
import parseLatitude from "../helpers/parseLatitude.js";
import parseLongitude from "../helpers/parseLongitude.js";
import parseTime from "../helpers/parseTime.js";
import UbloxMessage from "./UbloxMessage.js";

/**
 * # `GLL` - Geographic position - latitude and longitude
 *
 * ```txt
 *         1       2 3        4 5         6 7  8
 *         |       | |        | |         | |  |
 *  $--GLL,llll.ll,a,yyyyy.yy,a,hhmmss.ss,a,m,*hh<CR><LF>
 * ```
 *
 * Field Number:
 * 1. Latitude
 * 2. `N` or `S` (North or South)
 * 3. Longitude
 * 4. `E` or `W` (East or West)
 * 5. Universal Time Coordinated (UTC)
 * 6. Status
 *     - `A` - Data Valid
 *     - `V` - Data Invalid
 * 7. FAA mode indicator (NMEA 2.3 and later)
 * 8. Checksum
 */
export default class UbloxGllMessage extends UbloxMessage {
    static sentenceId = SentenceId.GLL;
    static sentenceName = "Geographic position - latitude and longitude";
    static cid = 0xf0;
    static mid = 0x01;

    static parse(fields) {
        return {
            latitude: parseLatitude(fields[1], fields[2]),
            longitude: parseLongitude(fields[3], fields[4]),
            time: parseTime(fields[5], ""),
            status: fields[6] == "A" ? "A" : "V",
            statusStr: fields[6] == "A" ? "valid" : "invalid",
            faaMode: fields[7],
        };
    }
}

UbloxMessage.registerClass(UbloxGllMessage);
