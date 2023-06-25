"use strict";

const Helper = require("../helper.js");
/*
* === GSA - Active satellites and dilution of precision ===
*
* ------------------------------------------------------------------------------
*         1 2 3  4  5  6  7  8  9  10 11 12 13 14 15  16  17  18
*         | | |  |  |  |  |  |  |  |  |  |  |  |  |   |   |   |
*  $--GSA,a,x,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,x.x,x.x,x.x*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
*
* 1. Selection of 2D or 3D fix
*    A - Automatic
*    M - Manual, forced to operate in 2D or 3D
* 2. 3D fix
*    1 - no fix
*    2 - 2D fix
*    3 - 3D fix
* 3. PRN of satellite used for fix (may be blank)
* ...
* 14. PRN of satellite used for fix (may be blank)
* 15. Dilution of precision
* 16. Horizontal dilution of precision
* 17. Vertical dilution of precision
* 18. Checksum
*/

class GSADecoder {
    constructor() {
        this.sentenceId = "GSA";
        this.sentenceName = "Active satellites and dilution of precision";
        this.selectionMode = ""; //fields[1] == "A" ? "automatic" : "manual";
        this.fixMode = ""; // ThreeDFixTypes[Helper.parseIntX(fields[2])];
        this.satellites = ""; // sats;
        this.PDOP = ""; // Helper.parseFloatX(fields[15]);
        this.HDOP = ""; // Helper.parseFloatX(fields[16]);
        this.VDOP = ""; // Helper.parseFloatX(fields[17]);
    }
    parse = function(fields) {
        var ThreeDFixTypes = ["unknown", "none", "2D", "3D"];
        try {
            var sats = new Array();
            for (var i = 3; i < 15; i++) {
                if (fields[i].length > 0) {
                    sats.push(fields[i]);
                }
            }
            
            this.selectionMode = fields[1] == "A" ? "automatic" : "manual";
            this.fixMode = ThreeDFixTypes[Helper.parseIntX(fields[2])];
            this.satellites = sats;
            this.PDOP = Helper.parseFloatX(fields[15]);
            this.HDOP = Helper.parseFloatX(fields[16]);
            this.VDOP = Helper.parseFloatX(fields[17]);
        }
        finally {}
    }
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = GSADecoder;