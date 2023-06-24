"use strict";

const Helper = require("../Helper.js");

/*
* === VTG - Track made good and ground speed ===
*
* ------------------------------------------------------------------------
        x[7]: 230394       Date - 23rd of March 1994------
*        1     2 3     4 5   6 7   8 9  10
*        |     | |     | |   | |   | |  |
* $--VTG,xxx.x,T,xxx.x,M,x.x,N,x.x,K,m,*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
*
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
class VTGDecoder { 
    constructor() {
        this.sentenceId = "VTG";
        this.sentenceName = "Track made good and ground speed";
        this.trackTrue = ""; // Helper.parseFloatX(fields[1]);
        this.trackMagnetic = ""; // Helper.parseFloatX(fields[3]);
        this.speedKnots = ""; // Helper.parseFloatX(fields[5]);
        this.speedKmph = ""; // Helper.parseFloatX(fields[7]);
        this.faaMode = ""; // fields[9];
    }
    parse = function(fields) {
        try {
            this.trackTrue = Helper.parseFloatX(fields[1]);
            this.trackMagnetic = Helper.parseFloatX(fields[3]);
            this.speedKnots = Helper.parseFloatX(fields[5]);
            this.speedKmph = Helper.parseFloatX(fields[7]);
            this.faaMode = fields[9];
        }
        finally {}   
    }
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = VTGDecoder;