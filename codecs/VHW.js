"use strict";

const helper = require("../helper.js");

/*
* === VHW – Water speed and heading ===
*
* ------------------------------------------------------------------------------
*        1   2 3   4 5   6 7   8 9
*        |   | |   | |   | |   | |
* $--VHW,x.x,T,x.x,M,x.x,N,x.x,K*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. Degress True
* 2. T = True
* 3. Degrees Magnetic
* 4. M = Magnetic
* 5. Knots (speed of vessel relative to the water)
* 6. N = Knots
* 7. Kilometers (speed of vessel relative to the water)
* 8. K = Kilometers
* 9. Checksum
*/
class VHWDecoder {
    constructor() {
        this.sentenceId = "VHW";
        this.sentenceName = "Water speed and heading";
        this.degreesTrue = "";
        this.degreesMagnetic = "";
        this.speedKnots = "";
        this.speedKmph = "";
    }
    parse = function(fields) {
        try {
            this.degreesTrue = helper.parseFloatX(fields[1]);
            this.degreesMagnetic = helper.parseFloatX(fields[3]);
            this.speedKnots = helper.parseFloatX(fields[5]);
            this.speedKmph = helper.parseFloatX(fields[7]);
        }
        finally {}   
    }
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = VHWDecoder;