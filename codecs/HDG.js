"use strict";

const helper = require("../helper.js");

/*
* === HDG - Heading - deviation and variation ===
*
* ------------------------------------------------------------------------------
*        1   2   3 4   5 6
*        |   |   | |   | |
* $--HDG,x.x,x.x,a,x.x,a*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. Magnetic Sensor heading in degrees
* 2. Magnetic Deviation, degrees
* 3. Magnetic Deviation direction, E = Easterly, W = Westerly
* 4. Magnetic Variation, degrees
* 5. Magnetic Variation direction, E = Easterly, W = Westerly
* 6. Checksum
*/

class HDGDecoder { 
    constructor() {
        this.sentenceId = "HDG";
        this.sentenceName = "Heading - deviation and variation";
        this.heading = "";
        this.deviation = "";
        this.deviationDirection = "";
        this.variation = "";
        this.variationDirection = "";
    }
    parse = function(fields) {
        try {
            this.heading = helper.parseFloatX(fields[1]);
            this.deviation = helper.parseFloatX(fields[2]);
            this.deviationDirection = fields[3] == "E" ? "E" : fields[3] == "W" ? "W" : "";
            this.variation = helper.parseFloatX(fields[4]);
            this.variationDirection = fields[5] == "E" ? "E" : fields[5] == "W" ? "W" : "";
        }
        finally {}
    }
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = HDGDecoder;