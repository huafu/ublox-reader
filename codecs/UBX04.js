"use strict";

const helper = require("../helper.js");

/*
* === UBX04 - Time of day and clock information ===
*
* UBX ID = "04"
* ------------------------------------------------------------------------------------------------------------


* Field Number:
*
* 1. Propietary message identifier: 04
* 2. UTC Time
* 3. UTC Date
* 4. UTC time of week
* 5. UTC week number, continues beyond 1023
* 6. Leap seconds
* 7. Receiver clock bias
* 8. Receiver clock drift
* 9. Time pulse granularity
* 10. Checksum
*/
class UBX04Decoder { 
    constructor() {
        this.sentenceId = "UBX04";
        this.sentenceName = "Time of day and clock information";
        this.cid = 0xF1;
        this.mid = 0x04;
        this.utcDateTime = "";
        this.utcTow = "";
        this.utcWeek = "";
        this.leapSec = "";
        this.clkBias = "";
        this.clkDrift = "";
        this.tpGranularity = "";
    }
    parse = function(fields) {
        try {        
            this.utcDateTime = helper.parseDateTime(fields[3], fields[2]);
            this.utcTow = helper.parseIntX(fields[4]);
            this.utcWeek = helper.parseIntX(fields[5]);
            this.leapSec = helper.parseIntX(fields[6]);
            this.clkBias = helper.parseIntX(fields[7]);
            this.clkDrift = helper.parseIntX(fields[8]);
            this.tpGranularity = helper.parseIntX(fields[9]);
        }
        finally {}
    }

    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = UBX04Decoder;