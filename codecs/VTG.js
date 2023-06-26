"use strict";

const helper = require("../helper.js");
const configurator = require("../configurator.js");
/*
* === VTG - Course over ground and ground speed ===
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
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        // this.msgconfig = new Uint8Array([0xF0, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "VTG";
        this.sentenceName = "Course over ground and ground speed";
        this.cid = 0xF0;
        this.mid = 0x05;
        this.trackTrue = "";
        this.trackMagnetic = "";
        this.speedKnots = "";
        this.speedKmph = "";
        this.faaMode = "";
    }

    parse = function(fields) {
        try {
            this.trackTrue = helper.parseFloatX(fields[1]);
            this.trackMagnetic = helper.parseFloatX(fields[3]);
            this.speedKnots = helper.parseFloatX(fields[5]);
            this.speedKmph = helper.parseFloatX(fields[7]);
            this.faaMode = fields[9];
        }
        finally {}   
    }

    subscribe = function(enable) {
        if (enable) {
            configurator.setMessageEnabled(this.cid, this.mid, 0x01);
        }
        else {
            configurator.setMessageEnabled(this.cid, this.mid, 0x00);
        }
    }
    
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = VTGDecoder;