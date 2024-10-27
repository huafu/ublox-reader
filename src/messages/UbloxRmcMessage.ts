import { SentenceId } from "../constants";
import parseDateTime from "../helpers/parseDateTime";
import parseFloatX from "../helpers/parseFloatX";
import parseLatitude from "../helpers/parseLatitude";
import parseLongitude from "../helpers/parseLongitude";
import UbloxMessage from "./UbloxMessage";

/**
 * # `RMC` - Recommended minimum navigation information
 *
 * ```txt
 *                                                              12
 *        1         2 3       4 5        6 7   8   9      10  11|  13
 *        |         | |       | |        | |   |   |      |   | |  |
 * $--RMC,hhmmss.ss,A,llll.ll,a,yyyyy.yy,a,x.x,x.x,ddmmyy,x.x,a,m,*hh<CR><LF>
 * ```
 *
 * Field Number:
 * 1. UTC Time
 * 2. Status
 *     - `A` = Valid
 *     - `V` = Navigation receiver warning
 * 3. Latitude
 * 4. `N` or `S`
 * 5. Longitude
 * 6. `E` or `W`
 * 7. Speed over ground, knots
 * 8. Track made good, degrees true
 * 9. Date, `ddmmyy`
 * 10. Magnetic Variation, degrees
 * 11. `E` or `W`
 * 12. FAA mode indicator (NMEA 2.3 and later)
 * 13. Checksum
 */
export default class UbloxRmcMessage extends UbloxMessage<SentenceId.RMC> {
    static readonly sentenceId = SentenceId.RMC;
    static readonly sentenceName = "Recommended minimum navigation information";
    static readonly cid = 0xf0;
    static readonly mid = 0x04;

    protected static parse(fields: string[]): object {
        return {
            datetime: parseDateTime(fields[9], fields[1]),
            status: fields[2] == "A" ? "A" : "V",
            statusStr: fields[2] == "A" ? "valid" : "warning",
            latitude: parseLatitude(fields[3], fields[4]),
            longitude: parseLongitude(fields[5], fields[6]),
            speedKnots: parseFloatX(fields[7]),
            trackTrue: parseFloatX(fields[8]),
            variation: parseFloatX(fields[10]),
            variationPole:
                fields[11] == "E" ? "E" : fields[11] == "W" ? "W" : "",
            faaMode: fields[12],
        };
    }
}

UbloxMessage.registerClass(UbloxRmcMessage);
