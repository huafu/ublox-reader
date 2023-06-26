"use strict";

const helper = require("../helper.js");

/*
* === TXT - Human readable text information for display purposes ===
*
* -------------------------------
*         1  2  3  4   5
*         |  |  |  |   |
*  $--TXT,xx,xx,xx,c-c,*hh<CR><LF>
* -------------------------------
*
* Field Number:
*
* 1. Total number of sentences
* 2. Sentence number
* 3. Text Id
* 4. Message text, up to 61 characters
* 5. Checksum
*/
class TXTDecoder { 
    constructor() {
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        // this.msgconfig = new Uint8Array([0xF0, 0x41, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "TXT";
        this.sentenceName = "Human readable text information for display purposes";
        this.cid = 0xF0;
        this.mid = 0x41;
        this.numberOfSentences = "";
        this.sentenceNumber = "";
        this.textId = "";
        this.textInformation = "";
    }
    
    parse = function(fields) {
        try {
            this.numberOfSentences = helper.parseIntX(fields[1]);
            this.sentenceNumber = helper.parseIntX(fields[2]);
            this.textId = helper.parseIntX(fields[3]);
            this.textInformation = fields[4];
        }
        finally {}
    }

    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = TXTDecoder;