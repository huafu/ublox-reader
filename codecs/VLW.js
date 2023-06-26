"use strict";

const helper = require("../helper.js");

/*
* === VLW – Dual ground/water distance ===
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
class VLWDecoder {
    constructor() {
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        // this.msgconfig = new Uint8Array([0xF0, 0x0F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "VLW";
        this.sentenceName = "Dual ground/water distance";
        this.cid = 0xF0;
        this.mid = 0x0F;
        this.twd = 0;
        this.twdUnit = "";  
        this.wd = 0;
        this.wdUnit = "";
        this.tgd = 0;
        this.tgdUnit = "";
        this.gd = 0;
        this.gdUnit = "";
        this.speedKnots = "";
        this.speedKmph = "";
    }

    parse = function(fields) {
        try {
            this.twd = fields[1];
            this.twdUnit = fields[2];  
            this.wd = fields[3];
            this.wdUnit = fields[4];
            this.tgd = fields[5];
            this.tgdUnit = fields[6];
            this.gd = fields[7];
            this.gdUnit = fields[8];
        }
        finally {}   
    }

    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = VLWDecoder;