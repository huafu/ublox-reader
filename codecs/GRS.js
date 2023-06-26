"use strict";

const helper = require("../helper.js");
const configurator = require("../configurator.js");
/*
    * === GRS - GNSS range residuals ===
    *
    * --------------------------------------------------------------------------------------------------
    *                    [1   2   3   4   5   6   7   8   9  10  11  12]
    *        1         2  3   4   5   6   7   8   9  10  11  12  13  14  15 16  17  
    *        |         |  |   |   |   |   |   |   |   |   |   |   |   |  |  |   |   
    * $--GRS,hhmmss.ss,x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,x.x,hh,hh,*hh<CR><LF>
    * --------------------------------------------------------------------------------------------------
    *
    * Field Number:
    * 1. Time (UTC)
    * 2. Mode
    * 3. Residual (3 - 14, 12 fields, matching order of GSA sentence)
    * 15. systemId
    * 16. signalId
    * 17. Checksum
*/
class GRSDecoder {
    constructor() {
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        // this.msgconfig = new Uint8Array([0xF0, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "GSA";
        this.sentenceName = "GNSS range residuals";
        this.cid = 0xF0;
        this.mid = 0x06;
        this.time = ""; 
        this.mode = ""; 
        this.residual = []; 
        this.systemId = 0; 
        this.signalId = 0;
    }
    parse = function(fields) {
        try {
            this.time =  helper.parseTime(fields[1], "");
            this.mode =  fields[2];
            for (var x = 3; x < 15; x++) {
                this.residual.push(fields[x]);
            }
            this.systemId = fields[15]; 
            this.signalId = fields[16];
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

module.exports = GRSDecoder;