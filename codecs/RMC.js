"use strict";

const Helper = require("../helper.js");

/*
* === RMC - Recommended minimum navigation information ===
*
* ------------------------------------------------------------------------------
*                                                              12
*        1         2 3       4 5        6 7   8   9      10  11|  13
*        |         | |       | |        | |   |   |      |   | |  |
* $--RMC,hhmmss.ss,A,llll.ll,a,yyyyy.yy,a,x.x,x.x,ddmmyy,x.x,a,m,*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. UTC Time
* 2. Status
*    A = Valid
*    V = Navigation receiver warning
* 3. Latitude
* 4. N or S
* 5. Longitude
* 6. E or W
* 7. Speed over ground, knots
* 8. Track made good, degrees true
* 9. Date, ddmmyy
* 10. Magnetic Variation, degrees
* 11. E or W
* 12. FAA mode indicator (NMEA 2.3 and later)
* 13. Checksum
*/

class RMCDecoder {
    constructor() {
        this.sentenceId = "RMC";
        this.sentenceName = "Recommended minimum navigation information";
        this.datetime = ""; // Helper.parseDateTime(fields[9], fields[1]);"
        this.status = ""; // fields[2] == "A" ? "valid" : "warning";
        this.latitude = ""; // Helper.parseLatitude(fields[3], fields[4]);
        this.longitude = ""; // Helper.parseLongitude(fields[5], fields[6]);
        this.speedKnots = ""; // Helper.parseFloatX(fields[7]);
        this.trackTrue = ""; // Helper.parseFloatX(fields[8]);
        this.variation = ""; // Helper.parseFloatX(fields[10]);
        this.variationPole = ""; // fields[11] == "E" ? "E" : fields[11] == "W" ? "W" : "";
        this.faaMode = ""; // fields[12];
    }
    
    parse = function(fields) {
        try {
            this.datetime = Helper.parseDateTime(fields[9], fields[1]);
            this.status = fields[2] == "A" ? "valid" : "warning";
            this.latitude = Helper.parseLatitude(fields[3], fields[4]);
            this.longitude = Helper.parseLongitude(fields[5], fields[6]);
            this.speedKnots = Helper.parseFloatX(fields[7]);
            this.trackTrue = Helper.parseFloatX(fields[8]);
            this.variation = Helper.parseFloatX(fields[10]);
            this.variationPole = fields[11] == "E" ? "E" : fields[11] == "W" ? "W" : "";
            this.faaMode = fields[12];
        }
        finally {}
    }
    
    getJson = function(){
        return Helper.outputJson(this);   
    }
}

module.exports = RMCDecoder;