"use strict";

const helper = require("../helper.js");

/*
* === DTM - Datum reference ===
*
* ------------------------------------------------------------------------------
*           1  2  3   4  5   6  7  8    9
*           |  |  |   |  |   |  |  |    |
*  $ --DTM,ref,x,llll,c,llll,c,aaa,ref*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. Local datum code.
*    W84 - WGS84
*    W72 - WGS72
*    S85 - SGS85
*    P90 - PE90
*    999 - User defined IHO datum code
* 2. Local datum subcode. May be blank.
* 3. Latitude offset (minutes)
* 4. N or S
* 5. Longitude offset (minutes)
* 6. E or W
* 7. Altitude offset in meters
* 8. Datum name. What’s usually seen here is "W84", the standard WGS84 datum used by GPS.
* 9. Checksum
*/
class DTMDecoder { 
    constructor() {
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        // this.msgconfig = new Uint8Array([0xF0, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "DTM"; 
        this.sentenceName = "Datum reference";
        this.class = 0xF0;
        this.id = 0x06;
        this.datumCode = ""; 
        this.datumSubcode = ""; 
        this.offsetLatitude = ""; 
        this.offsetLongitude = ""; 
        this.offsetAltitudeMeters = ""; 
        this.datumName = ""; 
    }
    parse = function(fields) {
        try {
            this.datumCode = this.parseDatumCode(fields[1]);
            this.datumSubcode = fields[2];
            this.offsetLatitude = helper.parseLatitude(fields[3], fields[4]);
            this.offsetLongitude = helper.parseLongitude(fields[5], fields[6]);
            this.offsetAltitudeMeters = helper.parseFloatX(fields[7]);
            this.datumName = this.parseDatumCode(fields[8]);
        }
        finally {}
    }
    getJson = function() {
        return helper.outputJson(this);   
    }
    
    subscribe = function(enable) {
        if (enable) {
            this.msgconfig[5] = 0x01;
        }
        else {
            this.msgconfig[5] = 0x00;
        }
    }

    parseDatumCode = function(field) {
            return field == "W84" ? "W84"
                : field == "W72" ? "W72"
                    : field == "S85" ? "S85"
                        : field == "P90" ? "P90"
                            : field == "999" ? "999"
                                : "";
    }
}
module.exports = DTMDecoder;
