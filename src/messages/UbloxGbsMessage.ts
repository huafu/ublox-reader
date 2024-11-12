import { SentenceId } from "../constants";
import parseFloatX from "../helpers/parseFloatX";
import parseTime from "../helpers/parseTime";
import UbloxMessage from "./UbloxMessage";

export interface UbloxGbsMessageData {
    time: Date;
    errLat: number;
    errLon: number;
    errAlt: number;
    svid: string;
    prob: string;
    bias: number;
    stddev: number;
    systemId: string;
    signalId: string;
}
/**
 * # `GBS` - GNSS satellite fault detection
 *
 * ```txt
 *            1      2   3   4   5 6   7    8   9   10   11
 *            |      |   |   |   | |   |    |   |    |    |
 * $--GBS,hhmmss.ss,l.6 1.4,3.2,03,x,-21.4,3.8.0x8A,0xB5 *hh<CR><LF>
 * ```
 * Field Number:
 * 1. Time (UTC)
 * 2. `errLat` - Expected error in Latitude
 * 3. `errLon` - Expected error in Longitude
 * 4. `errAlt` - Expected error in Altitude
 * 5. `svid` - Satellite ID of most likely failed satellite
 * 6. `prob` - Probability of missed detection: null (not supported, fixed field)
 * 7. `bias` - Estimated bias of most likely failed satellite (a priori residual)
 * 8. `stddev` - Standard deviation of estimated bias
 * 9. `systemId` - NMEA-defined GNSS system ID
 * 10. `signalId` - NMEA-defined GNSS signal ID
 * 11. Checksum
 */
export default class UbloxGbsMessage extends UbloxMessage<
    SentenceId.GBS,
    UbloxGbsMessageData
> {
    static readonly sentenceId = SentenceId.GBS;
    static readonly sentenceName = "GNSS satellite fault detection";
    static readonly cid = 0xf0;
    static readonly mid = 0x09;

    protected static parse(fields: string[]): UbloxGbsMessageData {
        return {
            time: parseTime(fields[1]),
            errLat: parseFloatX(fields[2]),
            errLon: parseFloatX(fields[3]),
            errAlt: parseFloatX(fields[4]),
            svid: fields[5],
            prob: "",
            bias: parseFloatX(fields[7]),
            stddev: parseFloatX(fields[8]),
            systemId: fields[9],
            signalId: fields[10],
        };
    }
}

UbloxMessage.registerClass(UbloxGbsMessage);
