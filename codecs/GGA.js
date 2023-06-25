"use strict";

const Helper = require("../helper.js");

/*
    * === GGA - Global positioning system fix data ===
    *
    * ------------------------------------------------------------------------------
    *                                                      11
    *        1         2       3 4        5 6 7  8   9  10 |  12 13  14   15
    *        |         |       | |        | | |  |   |   | |   | |   |    |
    * $--GGA,hhmmss.ss,llll.ll,a,yyyyy.yy,a,x,xx,x.x,x.x,M,x.x,M,x.x,xxxx*hh<CR><LF>
    * ------------------------------------------------------------------------------
    *
    * Field Number:
    * 1. Time (UTC)
    * 2. Latitude
    * 3. N or S (North or South)
    * 4. Longitude
    * 5. E or W (East or West)
    * 6. GPS Quality Indicator,
    *    0 - fix not available,
    *    1 - GPS fix,
    *    2 - Differential GPS fix
    *    3 = PPS fix
    *    4 = Real Time Kinematic
    *    5 = Float RTK
    *    6 = Estimated (dead reckoning)
    *    7 = Manual input mode
    *    8 = Simulation mode
    * 7. Number of satellites in view, 00 - 12
    * 8. Horizontal Dilution of precision
    * 9. Antenna Altitude above/below mean-sea-level (geoid)
    * 10. Units of antenna altitude, meters
    * 11. Geoidal separation, the difference between the WGS-84 earth
    *     ellipsoid and mean-sea-level (geoid), "-" means mean-sea-level below ellipsoid
    * 12. Units of geoidal separation, meters
    * 13. Age of differential GPS data, time in seconds since last SC104
    *     type 1 or 9 update, null field when DGPS is not used
    * 14. Differential reference station ID, 0000-1023
    * 15. Checksum
*/
class GGADecoder { 
    constructor() {
        this.sentenceId = "GGA";
        this.sentenceName = "Global positioning system fix data";
        this.time = ""; // Helper.parseTime(fields[1], "");
        this.latitude = ""; // Helper.parseLatitude(fields[2], fields[3]);
        this.longitude = ""; // Helper.parseLongitude(fields[4], fields[5]);
        this.fixType = ""; // FixTypes[Helper.parseIntX(fields[6])];
        this.satellitesInView = ""; // Helper.parseIntX(fields[7]);
        this.horizontalDilution = ""; // Helper.parseFloatX(fields[8]);
        this.altitudeMeters = ""; // Helper.parseFloatX(fields[9]);
        this.geoidalSeperation = ""; // Helper.parseFloatX(fields[11]);
        this.differentialAge = ""; // Helper.parseFloatX(fields[13]);
        this.differentialRefStn = ""; // fields[14];
    }

    parse = function(fields) {
        var FixTypes = ["none", "fix", "delta", "pps", "rtk", "frtk", "estimated", "manual", "simulation"];
        try {
            this.time = Helper.parseTime(fields[1], "");
            this.latitude = Helper.parseLatitude(fields[2], fields[3]);
            this.longitude = Helper.parseLongitude(fields[4], fields[5]);
            this.fixType = FixTypes[Helper.parseIntX(fields[6])];
            this.satellitesInView = Helper.parseIntX(fields[7]);
            this.horizontalDilution = Helper.parseFloatX(fields[8]);
            this.altitudeMeters = Helper.parseFloatX(fields[9]);
            this.geoidalSeperation = Helper.parseFloatX(fields[11]);
            this.differentialAge = Helper.parseFloatX(fields[13]);
            this.differentialRefStn = fields[14];
        }
        finally {}
    }
    
    getJson = function() {
        return Helper.outputJson(this);   
    }   
} 

module.exports = GGADecoder;