"use strict";

const Helper = require("../helper.js");
/*
    * === GNS - GNSS fix data ===
    *
    * ------------------------------------------------------------------------------
    *                                                        11
    *        1         2       3 4        5 6 7  8   9  10   |    12  13
    *        |         |       | |        | | |  |   |   |   |    |   |
    * $--GNS,hhmmss.ss,llll.ll,N,yyyyy.yy,W,x,xx,x.x,x.x,x.x,null,xxxx*hh<CR><LF>
    * ------------------------------------------------------------------------------
    *
    * Field Number:
    * 1. Time (UTC)
    * 2. Latitude
    * 3. N or S (North or South)
    * 4. Longitude
    * 5. E or W (East or West)
    * 6. Mode Indicator - Variable Length,
    *    N - fix not available,
    *    A - GPS fix,
    *    D - Differential GPS fix
    *    P = PPS fix
    *    R = Real Time Kinematic
    *    F = Float RTK
    *    E = Estimated (dead reckoning)
    *    M = Manual input mode
    *    S = Simulation mode
    * 7. Number of satellites in view, 00 - 12
    * 8. Horizontal Dilution of precision
    * 9. Orthometric height in meters (MSL reference)
    * 10. Geoidal separation in meters - the difference between the earth ellipsoid surface and mean-sea-level (geoid) surface
    *     defined by the reference datum used in the position solution
    * 11. Age of differential data - Null if talker ID is GN, additional GNS messages follow with GP and/or GL Age of differential data
    * 12. Reference station ID1, range 0000-4095
    * 13. Checksum
*/
class GNSDecoder {
    constructor() {
        this.sentenceId = "GNS";
        this.sentenceName = "GNSS fix data";
        this.time = ""; // Helper.parseTime(fields[1], "");
        this.latitude = ""; // Helper.parseLatitude(fields[2], fields[3]);
        this.longitude = ""; // Helper.parseLongitude(fields[4], fields[5]);
        this.modeIndicator = ""; // fields[6];
        this.satellitesInView = ""; // Helper.parseIntX(fields[7]);
        this.horizontalDilution = ""; // Helper.parseFloatX(fields[8]);
        this.altitudeMeters = ""; // Helper.parseFloatX(fields[9]);
        this.geoidalSeperation = ""; // Helper.parseFloatX(fields[10]);
        this.differentialAge = ""; // Helper.parseFloatX(fields[11]);
        this.differentialRefStn = ""; // fields[12];
    }
    parse = function(fields) {
        try {
            this.time =  Helper.parseTime(fields[1], "");
            this.latitude =  Helper.parseLatitude(fields[2], fields[3]);
            this.longitude =  Helper.parseLongitude(fields[4], fields[5]);
            this.modeIndicator = fields[6];
            this.satellitesInView =  Helper.parseIntX(fields[7]);
            this.horizontalDilution =  Helper.parseFloatX(fields[8]);
            this.altitudeMeters =  Helper.parseFloatX(fields[9]);
            this.geoidalSeperation =  Helper.parseFloatX(fields[10]);
            this.differentialAge =  Helper.parseFloatX(fields[11]);
            this.differentialRefStn = fields[12];
        }
        finally {}
    }
    
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = GNSDecoder;