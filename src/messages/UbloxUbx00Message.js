/**
 * `UBX00` -  Lat/Long position data
 *
 * ```txt
 *        1   2          3          4  5           6  7  8   9  10 11 12 13 14 15 16 17 18 19 20 21
 *        |   |          |          |  |           |  |  |   |  |  |  |  |  |  |  |  |  |  |  |  |
 *  $PUBX,00, hhmmss.ss, ddmm.mmmm, c, dddmm.mmmm, c, x, cc, x, x, x, x, x, x, x, x, x, x, x, x, *hh<CR><LF>
 * ```
 *
 * 1. Proprietary message identifier: 00
 * 2. UTC Time, Current time
 * 3. Latitude, Degrees + minutes
 * 4. `N`/`S` Indicator, `N`=north or `S`=south
 * 5. Longitude, Degrees + minutes
 * 6. `E`/`W` Indicator, `E`=east or `W`=west
 * 7. Altitude above user datum ellipsoid
 * 8. Navigation Status, See Table below
 * 9. Horizontal accuracy estimate
 * 10. Vertical accuracy estimate
 * 11. SOG, Speed over ground
 * 12. COG, Course over ground
 * 13. Vertical velocity, positive=downwards
 * 14. Age of most recent DGPS corrections, empty = none available
 * 15. HDOP, Horizontal Dilution of Precision
 * 16. VDOP, Vertical Dilution of Precision
 * 17. TDOP, Time Dilution of Precision
 * 18. Number of GPS satellites used in the navigation solution
 * 19. Number of GLONASS satellites used in the navigation solution
 * 20. DR used
 * 21. Checksum
 */

import { SentenceId } from "../helpers/constants.js";
import parseFloatX from "../helpers/parseFloatX.js";
import UbloxMessage from "./UbloxMessage.js";

export default class UbloxUbx00Message extends UbloxMessage {
    static sentenceId = SentenceId.UBX00;
    static sentenceName = "Lat/Long position data";
    static cid = 0xf1;
    static mid = 0x00;

    static parse(fields) {
        return {
            utcTime: fields[2],
            latitude: parseFloatX(fields[3]),
            nsIndicator: fields[4],
            longitude: parseFloatX(fields[5]),
            ewIndicator: fields[6],
            altRef: parseFloatX(fields[7]),
            navStatus: fields[8],
            hAccuracy: parseFloatX(fields[9]),
            vAccuracy: parseFloatX(fields[10]),
            speedOverGround: parseFloatX(fields[11]),
            courseOverGround: parseFloatX(fields[12]),
            vVelocity: parseFloatX(fields[13]),
            ageCorrections: parseFloatX(fields[14]),
            hdop: parseFloatX(fields[15]),
            vdop: parseFloatX(fields[16]),
            tdop: parseFloatX(fields[17]),
            gpsSatellites: parseFloatX(fields[18]),
            glonassSatellites: parseFloatX(fields[19]),
            drUsed: parseFloatX(fields[20]),
        };
    }
}

UbloxMessage.registerClass(UbloxUbx00Message);
