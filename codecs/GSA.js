"use strict";

const helper = require("../helper.js");

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
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        // this.msgconfig = new Uint8Array([0xF0, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "GSA";
        this.sentenceName = "Active satellites and dilution of precision";
        this.cid = 0xF0;
        this.mid = 0x02;
        this.selectionMode = "";
        this.fixMode = "";
        this.satellites = "";
        this.PDOP = "";
        this.HDOP = "";
        this.VDOP = "";
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
            this.fixMode = ThreeDFixTypes[helper.parseIntX(fields[2])];
            this.satellites = sats;
            this.PDOP = helper.parseFloatX(fields[15]);
            this.HDOP = helper.parseFloatX(fields[16]);
            this.VDOP = helper.parseFloatX(fields[17]);
        }
        finally {}
    }

    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = GSADecoder;