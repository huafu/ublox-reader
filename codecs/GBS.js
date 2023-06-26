"use strict";

const helper = require("../helper.js");

/*
    * === GBS - GNSS satellite fault detection ===
    *
    * -----------------------------------------------------------------
    *            1      2   3   4   5 6   7    8   9   10   11
    *            |      |   |   |   | |   |    |   |    |    |   
    * $--GBS,hhmmss.ss,l.6 1.4,3.2,03,x,-21.4,3.8.0x8A,0xB5 *hh<CR><LF>
    * -----------------------------------------------------------------
    *
    * Field Number:
    * 1. Time (UTC)
    * 2. errLat - Expected error in Latitude
    * 3. errLon - Expected error in Longitude
    * 4. errAlt - Expected error in Altitude
    * 5. svid - Satellite ID of most likely failed satellite
    * 6. prob - Probability of missed detection: null (not supported, fixed field) 
    * 7. bias - Estimated bias of most likely failed satellite (a priori residual)
    * 8. stddev - Standard deviation of estimated bias
    * 9. systemId - NMEA-defined GNSS system ID
    * 10. signalId - NMEA-defined GNSS signal ID
    * 11. Checksum
*/
class GBSDecoder { 
    constructor() {
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        // this.msgconfig = new Uint8Array([0xF0, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "GBS";
        this.sentenceName = "GNSS satellite fault detection";
        this.cid = 0xF0;
        this.mid = 0x09;
        this.time = "";
        this.errLat = "";
        this.errLon = "";
        this.errAlt = "";
        this.svid = "";
        this.prob = "";
        this.bias = "";
        this.stddev = "";
        this.systemId = "";
        this.signalId = "";
    }
    parse = function(fields) {
    try {
            this.time = helper.parseTime(fields[1], "");
            this.errLat = helper.parseFloatX(fields[2]);
            this.errLon = helper.parseFloatX(fields[3]);
            this.errAlt = helper.parseFloatX(fields[4]);
            this.svid = fields[5];
            this.prob = "";
            this.bias = helper.parseFloatX(fields[7]);
            this.stddev = helper.parseFloatX(fields[8]);
            this.systemId = fields[9];
            this.signalId = fields[10];
        }
        finally {}
    }
    
    getJson = function() {
        return helper.outputJson(this);   
    }   
} 

module.exports = GBSDecoder;