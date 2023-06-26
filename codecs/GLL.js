"use strict";

const helper = require("../helper.js");


/*
    * === GLL - Geographic position - latitude and longitude ===
    *
    * ------------------------------------------------------------------------------
    *         1       2 3        4 5         6 7  8
    *         |       | |        | |         | |  |
    *  $--GLL,llll.ll,a,yyyyy.yy,a,hhmmss.ss,a,m,*hh<CR><LF>
    * ------------------------------------------------------------------------------
    *
    * Field Number:
    *
    * 1. Latitude
    * 2. N or S (North or South)
    * 3. Longitude
    * 4. E or W (East or West)
    * 5. Universal Time Coordinated (UTC)
    * 6. Status
    *    A - Data Valid
    *    V - Data Invalid
    * 7. FAA mode indicator (NMEA 2.3 and later)
    * 8. Checksum
    */
class GLLDecoder { 
    constructor() {
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        // this.msgconfig = new Uint8Array([0xF0, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "GLL";
        this.sentenceName = "Geographic position - latitude and longitude";
        this.class = 0xF0;
        this.id = 0x01;
        this.latitude = ""; 
        this.longitude = "";
        this.time = "";
        this.status = ""; 
        this.faaMode = "";
    }
    parse = function(fields) {
        try {
            this.latitude = helper.parseLatitude(fields[1], fields[2]);
            this.longitude = helper.parseLongitude(fields[3], fields[4]);
            this.time = helper.parseTime(fields[5], "");
            this.status = fields[6] == "A" ? "valid" : "invalid";
            this.faaMode = fields[7];
        }
        finally {}
    }

    subscribe = function(enable) {
        if (enable) {
            this.msgconfig[5] = 0x01;
        }
        else {
            this.msgconfig[5] = 0x00;
        }
    }

    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = GLLDecoder;