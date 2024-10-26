import { SentenceId } from "../helpers/constants.js";
import parseFloatX from "../helpers/parseFloatX.js";
import parseTime from "../helpers/parseTime.js";
import UbloxMessage from "./UbloxMessage.js";

/**
 * # `GST` - GPS pseudorange noise statistics
 *
 * ```txt
 *        1         2   3   4   5   6   7   8    9
 *        |         |   |   |   |   |   |   |    |
 * $--GST,hhmmss.ss,x.x,x.x,x.x,x.x,x.x,x.x,x.x,*hh<CR><LF>
 * ```
 *
 * Field Number:
 * 1. UTC time of associated GGA fix
 * 2. RMS value of the standard deviation of the range inputs to the navigation
 *    process (range inputs include pseudoranges varror ellipse, meters
 * 4. Standard deviation of semi-minor axis of error ellipse, meters
 * 5. Orientation of semi-major axis of error ellipse, degrees from true north
 * 6. Standard deviation of latitude error, meters
 * 7. Standard deviation of longitude error, meters
 * 8. Standard deviation of altitude error, meters
 * 9. Checksum
 */
export default class UbloxGstMessage extends UbloxMessage {
    static sentenceId = SentenceId.GST;
    static sentenceName = "GPS pseudorange noise statistics";
    static cid = 0xf0;
    static mid = 0x07;

    static parse(fields) {
        return {
            time: parseTime(fields[1], ""),
            totalRms: parseFloatX(fields[2]),
            semiMajorError: parseFloatX(fields[3]),
            semiMinorError: parseFloatX(fields[4]),
            orientationOfSemiMajorError: parseFloatX(fields[5]),
            latitudeError: parseFloatX(fields[6]),
            longitudeError: parseFloatX(fields[7]),
            altitudeError: parseFloatX(fields[8]),
        };
    }
}

UbloxMessage.registerClass(UbloxGstMessage);
