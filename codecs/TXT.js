"use strict";

const Helper = require("../helper.js");

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
        this.sentenceId = "TXT";
        this.sentenceName = "Human readable text information for display purposes";
        this.numberOfSentences = ""; // Helper.parseIntX(fields[1]);
        this.sentenceNumber = ""; // Helper.parseIntX(fields[2]);
        this.textId = ""; // Helper.parseIntX(fields[3]);
        this.textInformation = ""; // fields[4];
    }
    
    parse = function(fields) {
        try {
            this.numberOfSentences = Helper.parseIntX(fields[1]);
            this.sentenceNumber = Helper.parseIntX(fields[2]);
            this.textId = Helper.parseIntX(fields[3]);
            this.textInformation = fields[4];
        }
        finally {}
    }
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = TXTDecoder;