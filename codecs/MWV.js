"use strict";

const helper = require("../helper.js");

/*
* === MWV - Wind speed and angle ===
*
* ------------------------------------------------------------------------------
*        1   2 3   4 5
*        |   | |   | |
* $--MWV,x.x,a,x.x,a*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
*
* 1. Wind Angle, 0 to 360 degrees
* 2. Reference, R = Relative, T = True
* 3. Wind Speed
* 4. Wind Speed Units, K/M/N
* 5. Status, A = Data Valid
* 6. Checksum
*/
class MWVDecoder {
    constructor() {
        this.sentenceId = "MWV";
        this.sentenceName = "Wind speed and angle";
        this.windAngle = "";
        this.reference = "";
        this.speed = "";
        this.units = "";
        this.status = "";
    } 
    parse = function(fields) {
        try {
            this.windAngle = helper.parseFloatX(fields[1]);
            this.reference = fields[2] == "R" ? "relative" : "true";
            this.speed = helper.parseFloatX(fields[3]);
            this.units = fields[4] == "K" ? "K" : fields[4] == "M" ? "M" : "N";
            this.status = fields[5] == "A" ? "valid" : "invalid";
        }
        finally {}   
    }
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = MWVDecoder;