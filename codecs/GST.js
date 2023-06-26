"use strict";

const helper = require("../helper.js");

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
        this.time = "";
        this.totalRms = "";
        this.semiMajorError = "";
        this.semiMinorError = "";
        this.orientationOfSemiMajorError = "";
        this.latitudeError = "";
        this.longitudeError = "";
        this.altitudeError = "";
    }
    parse = function(fields) {
        try {
            
            this.time = helper.parseTime(fields[1], "");
            this.totalRms = helper.parseFloatX(fields[2]);
            this.semiMajorError = helper.parseFloatX(fields[3]);
            this.semiMinorError = helper.parseFloatX(fields[4]);
            this.orientationOfSemiMajorError = helper.parseFloatX(fields[5]);
            this.latitudeError = helper.parseFloatX(fields[6]);
            this.longitudeError = helper.parseFloatX(fields[7]);
            this.altitudeError = helper.parseFloatX(fields[8]);
        }
        finally {}
    }    
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = GSTDecoder;