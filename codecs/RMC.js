"use strict";

const helper = require("../helper.js");

/*
* === RMC - Recommended minimum navigation information ===
*
* ------------------------------------------------------------------------------
*                                                              12
*        1         2 3       4 5        6 7   8   9      10  11|  13
*        |         | |       | |        | |   |   |      |   | |  |
* $--RMC,hhmmss.ss,A,llll.ll,a,yyyyy.yy,a,x.x,x.x,ddmmyy,x.x,a,m,*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. UTC Time
* 2. Status
*    A = Valid
*    V = Navigation receiver warning
* 3. Latitude
* 4. N or S
* 5. Longitude
* 6. E or W
* 7. Speed over ground, knots
* 8. Track made good, degrees true
* 9. Date, ddmmyy
* 10. Magnetic Variation, degrees
* 11. E or W
* 12. FAA mode indicator (NMEA 2.3 and later)
* 13. Checksum
*/

class RMCDecoder {
    constructor() {
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        // this.msgconfig = new Uint8Array([0xF0, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "RMC";
        this.sentenceName = "Recommended minimum navigation information";
        this.cid = 0xF0;
        this.mid = 0x04;
        this.datetime = "";
        this.status = "";
        this.latitude = "";
        this.longitude = "";
        this.speedKnots = "";
        this.trackTrue = "";
        this.variation = "";
        this.variationPole = "";
        this.faaMode = "";
    }
    
    parse = function(fields) {
        try {
            this.datetime = helper.parseDateTime(fields[9], fields[1]);
            this.status = fields[2] == "A" ? "valid" : "warning";
            this.latitude = helper.parseLatitude(fields[3], fields[4]);
            this.longitude = helper.parseLongitude(fields[5], fields[6]);
            this.speedKnots = helper.parseFloatX(fields[7]);
            this.trackTrue = helper.parseFloatX(fields[8]);
            this.variation = helper.parseFloatX(fields[10]);
            this.variationPole = fields[11] == "E" ? "E" : fields[11] == "W" ? "W" : "";
            this.faaMode = fields[12];
        }
        finally {}
    }
    
    getJson = function(){
        return helper.outputJson(this);   
    }
}

module.exports = RMCDecoder;