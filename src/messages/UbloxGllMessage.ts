import { SentenceId } from "../constants";
import parseLatitude from "../helpers/parseLatitude";
import parseLongitude from "../helpers/parseLongitude";
import parseTime from "../helpers/parseTime";
import UbloxMessage from "./UbloxMessage";

export interface UbloxGllMessageData {
    latitude: string;
    longitude: string;
    time: Date;
    status: "A" | "V";
    statusStr: "valid" | "invalid";
    faaMode: string;
}

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
export default class UbloxGllMessage extends UbloxMessage<
    SentenceId.GLL,
    UbloxGllMessageData
> {
    static readonly sentenceId = SentenceId.GLL;
    static readonly sentenceName =
        "Geographic position - latitude and longitude";
    static readonly cid = 0xf0;
    static readonly mid = 0x01;

    protected static parse(fields: string[]): UbloxGllMessageData {
        return {
            latitude: parseLatitude(fields[1], fields[2]),
            longitude: parseLongitude(fields[3], fields[4]),
            time: parseTime(fields[5]),
            status: fields[6] == "A" ? "A" : "V",
            statusStr: fields[6] == "A" ? "valid" : "invalid",
            faaMode: fields[7],
        };
    }
}

UbloxMessage.registerClass(UbloxGllMessage);
