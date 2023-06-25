"use strict";

const Helper = require("../helper.js");

/*
* === UBX00 -  Lat/Long position data ===
*
* -------------------------------
*        1   2          3          4  5           6  7  8   9  10 11 12 13 14 15 16 17 18 19 20 21
*        |   |          |          |  |           |  |  |   |  |  |  |  |  |  |  |  |  |  |  |  |
*  $PUBX,00, hhmmss.ss, ddmm.mmmm, c, dddmm.mmmm, c, x, cc, x, x, x, x, x, x, x, x, x, x, x, x, *hh<CR><LF>
* -------------------------------
*
* 1. Propietary message identifier: 00
* 2. UTC Time, Current time
* 3. Latitude, Degrees + minutes
* 4. N/S Indicator, N=north or S=south
* 5. Longitude, Degrees + minutes
* 6. E/W Indicator, E=east or W=west
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

class UBX00Decoder {
    constructor() {
        this.sentenceId = "UBX00";
        this.sentenceName = "Lat/Long position data";
        this.utcTime = ""; // fields[2];
        this.latitude = ""; // Helper.parseFloatX(fields[3]);
        this.nsIndicator = ""; // fields[4];
        this.longitude = ""; // Helper.parseFloatX(fields[5]);
        this.ewIndicator = ""; // fields[6];
        this.altRef = ""; // Helper.parseFloatX(fields[7]);
        this.navStatus = ""; // fields[8];
        this.hAccuracy = ""; // Helper.parseFloatX(fields[9]);
        this.vAccuracy = ""; // Helper.parseFloatX(fields[10]);
        this.speedOverGround = ""; // Helper.parseFloatX(fields[11]);
        this.courseOverGround = ""; // Helper.parseFloatX(fields[12]);
        this.vVelocity = ""; // Helper.parseFloatX(fields[13]);
        this.ageCorrections = ""; // Helper.parseFloatX(fields[14]);
        this.hdop = ""; // Helper.parseFloatX(fields[15]);
        this.vdop = ""; // Helper.parseFloatX(fields[16]);
        this.tdop = ""; // Helper.parseFloatX(fields[17]);
        this.gpsSatellites = ""; // Helper.parseFloatX(fields[18]);
        this.glonassSatellites = ""; // Helper.parseFloatX(fields[19]);
        this.drUsed = ""; // Helper.parseFloatX(fields[20]);
    }
    parse = function(fields) {
        try {
            this.utcTime = fields[2];
            this.latitude = Helper.parseFloatX(fields[3]);
            this.nsIndicator = fields[4];
            this.longitude = Helper.parseFloatX(fields[5]);
            this.ewIndicator = fields[6];
            this.altRef = Helper.parseFloatX(fields[7]);
            this.navStatus = fields[8];
            this.hAccuracy = Helper.parseFloatX(fields[9]);
            this.vAccuracy = Helper.parseFloatX(fields[10]);
            this.speedOverGround = Helper.parseFloatX(fields[11]);
            this.courseOverGround = Helper.parseFloatX(fields[12]);
            this.vVelocity = Helper.parseFloatX(fields[13]);
            this.ageCorrections = Helper.parseFloatX(fields[14]);
            this.hdop = Helper.parseFloatX(fields[15]);
            this.vdop = Helper.parseFloatX(fields[16]);
            this.tdop = Helper.parseFloatX(fields[17]);
            this.gpsSatellites = Helper.parseFloatX(fields[18]);
            this.glonassSatellites = Helper.parseFloatX(fields[19]);
            this.drUsed = Helper.parseFloatX(fields[20]);
        }
        finally {}
    }
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = UBX00Decoder;