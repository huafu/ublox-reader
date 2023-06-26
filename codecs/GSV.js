"use strict";

const helper = require("../helper.js");
/*
* === GSV - Satellites in view ===
*
* ------------------------------------------------------------------------------
*         1 2 3  4  5  6  7   8  9  10 11  12 13 14 15  16 17 18 19  20 21
*         | | |  |  |  |  |   |  |  |  |   |  |  |  |   |  |  |  |   |  |
*  $--GSA,x,x,xx,xx,xx,xx,xxx,xx,xx,xx,xxx,xx,xx,xx,xxx,xx,xx,xx,xxx,xx*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
*
* 1. Number of sentences for full data
* 2. Sentence number out of total
* 3. Number of satellites in view
* 4. PRN of satellite used for fix (may be blank)
*
* 5. Satellite PRN number     \
* 6. Elevation, degrees       +- Satellite 1
* 7. Azimuth, degrees         |
* 8. Signal to noise ratio    /
*
* 9. Satellite PRN number     \
* 10. Elevation, degrees      +- Satellite 2
* 11. Azimuth, degrees        |
* 12. Signal to noise ratio   /
*
* 13. Satellite PRN number    \
* 14. Elevation, degrees      +- Satellite 3
* 15. Azimuth, degrees        |
* 16. Signal to noise ratio   /
*
* 17. Satellite PRN number    \
* 18. Elevation, degrees      +- Satellite 4
* 19. Azimuth, degrees        |
* 20. Signal to noise ratio   /
*
* 21. Checksum
*/

class GSVSatellite {
    constructor(prn, ele, azi, snr) {
        this.prnNumber = prn;
        this.elevationDegrees = ele;
        this.azimuthTrue = azi;
        this.SNRdB = snr;
    }
}

class GSVDecoder {
    constructor() {
        this.sentenceId = "GSV";
        this.sentenceName = "Satellites in view"; 
        this.numberOfMessages = "";
        this.messageNumber = "";
        this.satellitesInView = "";
        this.satellites = new Array();
    }

    parse = function(fields) {
        try {
            var numRecords = (fields.length - 4) / 4;
            for (var i = 0; i < numRecords; i++) {
                var offset = i * 4 + 4;
                this.satellites.push(new GSVSatellite(helper.parseIntX(fields[offset]),
                                           helper.parseIntX(fields[offset + 1]),
                                           helper.parseIntX(fields[offset + 2]),
                                           helper.parseIntX(fields[offset + 3])));
            
            }
            
            this.numberOfMessages = helper.parseIntX(fields[1]);
            this.messageNumber = helper.parseIntX(fields[2]);
            this.satellitesInView = helper.parseIntX(fields[3]);
        }
        finally {}
    }
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = GSVDecoder;