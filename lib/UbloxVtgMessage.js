import { SentenceId } from "../helpers/constants.js";
import parseFloatX from "../helpers/parseFloatX.js";
import UbloxMessage from "./UbloxMessage.js";

/**
* # `VTG` - Course over ground and ground speed
*
* ```txt
        x[7]: 230394       Date - 23rd of March 1994------
*        1     2 3     4 5   6 7   8 9  10
*        |     | |     | |   | |   | |  |
* $--VTG,xxx.x,T,xxx.x,M,x.x,N,x.x,K,m,*hh<CR><LF>
* ```
*
* Field Number:
* 1. Track Degrees
* 2. T = True
* 3. Track Degrees
* 4. M = Magnetic
* 5. Speed Knots
* 6. N = Knots
* 7. Speed Kilometers Per Hour
* 8. K = Kilometers Per Hour
* 9. FAA mode indicator (NMEA 2.3 and later)
* 10. Checksum
*/
export default class UbloxVtgMessage extends UbloxMessage {
    static sentenceId = SentenceId.VTG;
    static sentenceName = "Course over ground and ground speed";
    static cid = 0xf0;
    static mid = 0x05;

    static parse(fields) {
        return {
            trackTrue: parseFloatX(fields[1]),
            trackMagnetic: parseFloatX(fields[3]),
            speedKnots: parseFloatX(fields[5]),
            speedKmph: parseFloatX(fields[7]),
            faaMode: fields[9],
        };
    }
}

UbloxMessage.registerClass(UbloxVtgMessage);
