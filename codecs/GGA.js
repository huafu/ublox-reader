"use strict";

const helper = require("../helper.js");

    /* === GGA - Global positioning system fix data ===
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
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        // this.msgconfig = new Uint8Array([0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "GGA";
        this.sentenceName = "Global positioning system fix data";
        this.cid = 0xF0;
        this.mid = 0x00;
        this.time = ""; 
        this.latitude = ""; 
        this.longitude = "";
        this.fixType = ""; 
        this.satellitesInView = "";
        this.horizontalDilution = "";
        this.altitudeMeters = ""; 
        this.geoidalSeperation = "";
        this.differentialAge = ""; 
        this.differentialRefStn = "";
    }

    parse = function(fields) {
        var FixTypes = ["none", "fix", "delta", "pps", "rtk", "frtk", "estimated", "manual", "simulation"];
        try {
            this.time = helper.parseTime(fields[1], "");
            this.latitude = helper.parseLatitude(fields[2], fields[3]);
            this.longitude = helper.parseLongitude(fields[4], fields[5]);
            this.fixType = FixTypes[helper.parseIntX(fields[6])];
            this.satellitesInView = helper.parseIntX(fields[7]);
            this.horizontalDilution = helper.parseFloatX(fields[8]);
            this.altitudeMeters = helper.parseFloatX(fields[9]);
            this.geoidalSeperation = helper.parseFloatX(fields[11]);
            this.differentialAge = helper.parseFloatX(fields[13]);
            this.differentialRefStn = fields[14];
        }
        finally {}
    }
    
    getJson = function() {
        return helper.outputJson(this);   
    }   
} 

module.exports = GGADecoder;