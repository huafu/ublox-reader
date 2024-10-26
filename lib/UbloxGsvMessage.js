import { SentenceId } from "../helpers/constants.js";
import parseIntX from "../helpers/parseIntX.js";
import UbloxMessage from "./UbloxMessage.js";

/**
 * Satellite
 */
class GsvSatellite {
    constructor(prn, ele, azi, snr) {
        this.prnNumber = prn;
        this.elevationDegrees = ele;
        this.azimuthTrue = azi;
        this.SNRdB = snr;
    }
}

/**
 * # `GSV` - Satellites in view
 *
 * ```txt
 *         1 2 3  4  5  6  7   8  9  10 11  12 13 14 15  16 17 18 19  20 21
 *         | | |  |  |  |  |   |  |  |  |   |  |  |  |   |  |  |  |   |  |
 *  $--GSA,x,x,xx,xx,xx,xx,xxx,xx,xx,xx,xxx,xx,xx,xx,xxx,xx,xx,xx,xxx,xx*hh<CR><LF>
 * ```
 *
 * Field Number:
 * 1. Number of sentences for full data
 * 2. Sentence number out of total
 * 3. Number of satellites in view
 * 4. PRN of satellite used for fix (may be blank)
 * 5. Satellite PRN number     \
 * 6. Elevation, degrees       +- Satellite 1
 * 7. Azimuth, degrees         |
 * 8. Signal to noise ratio    /
 * 9. Satellite PRN number     \
 * 10. Elevation, degrees      +- Satellite 2
 * 11. Azimuth, degrees        |
 * 12. Signal to noise ratio   /
 * 13. Satellite PRN number    \
 * 14. Elevation, degrees      +- Satellite 3
 * 15. Azimuth, degrees        |
 * 16. Signal to noise ratio   /
 * 17. Satellite PRN number    \
 * 18. Elevation, degrees      +- Satellite 4
 * 19. Azimuth, degrees        |
 * 20. Signal to noise ratio   /
 * 21. Checksum
 */
export default class UbloxGsvMessage extends UbloxMessage {
    static sentenceId = SentenceId.GSV;
    static sentenceName = "Satellites in view";
    static cid = 0xf0;
    static mid = 0x03;

    static parse(fields) {
        const satellites = [];
        const numRecords = (fields.length - 4) / 4;
        for (let i = 0; i < numRecords; i++) {
            const offset = i * 4 + 4;
            satellites.push(
                new GsvSatellite(
                    parseIntX(fields[offset]),
                    parseIntX(fields[offset + 1]),
                    parseIntX(fields[offset + 2]),
                    parseIntX(fields[offset + 3])
                )
            );
        }
        return {
            numberOfMessages: parseIntX(fields[1]),
            messageNumber: parseIntX(fields[2]),
            satellitesInView: parseIntX(fields[3]),
            satellites,
        };
    }
}

UbloxMessage.registerClass(UbloxGsvMessage);
