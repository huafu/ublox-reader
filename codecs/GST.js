"use strict";

const Helper = require("../helper.js");

/*
* === GST - GPS pseudorange noise statistics ===
*
* ------------------------------------------------------------------------------
*        1         2   3   4   5   6   7   8    9
*        |         |   |   |   |   |   |   |    |
* $--GST,hhmmss.ss,x.x,x.x,x.x,x.x,x.x,x.x,x.x,*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. UTC time of associated GGA fix
* 2. RMS value of the standard deviation of the range inputs to the navigation
*    process (range inputs include pseudoranges varror ellipse, meters
* 4. Standard deviation of semi-minor axis of error ellipse, meters
* 5. Orientation of semi-major axis of error ellipse, degrees from true north
* 6. Standard deviation of latitude error, meters
* 7. Standard deviation of longitude error, meters
* 8. Standard deviation of altitude error, meters
* 9. Checksum
*/

class GSTDecoder {
    constructor() {
        this.sentenceId = "GST";
        this.sentenceName = "GPS pseudorange noise statistics";
        this.time = ""; // Helper.parseTime(fields[1], "");
        this.totalRms = ""; // Helper.parseFloatX(fields[2]);
        this.semiMajorError = ""; // Helper.parseFloatX(fields[3]);
        this.semiMinorError = ""; // Helper.parseFloatX(fields[4]);
        this.orientationOfSemiMajorError = ""; // Helper.parseFloatX(fields[5]);
        this.latitudeError = ""; // Helper.parseFloatX(fields[6]);
        this.longitudeError = ""; // Helper.parseFloatX(fields[7]);
        this.altitudeError = ""; // Helper.parseFloatX(fields[8]);
    }
    parse = function(fields) {
        try {
            
            this.time = Helper.parseTime(fields[1], "");
            this.totalRms = Helper.parseFloatX(fields[2]);
            this.semiMajorError = Helper.parseFloatX(fields[3]);
            this.semiMinorError = Helper.parseFloatX(fields[4]);
            this.orientationOfSemiMajorError = Helper.parseFloatX(fields[5]);
            this.latitudeError = Helper.parseFloatX(fields[6]);
            this.longitudeError = Helper.parseFloatX(fields[7]);
            this.altitudeError = Helper.parseFloatX(fields[8]);
        }
        finally {}
    }    
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = GSTDecoder;