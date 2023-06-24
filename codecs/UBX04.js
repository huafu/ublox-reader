"use strict";

const Helper = require("../Helper.js");

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
        this.utcDateTime = ""; // Helper.parseDateTime(fields[3], fields[2]);
        this.utcTow = ""; // Helper.parseIntX(fields[4]);
        this.utcWeek = ""; // Helper.parseIntX(fields[5]);
        this.leapSec = ""; // Helper.parseIntX(fields[6]);
        this.clkBias = ""; // Helper.parseIntX(fields[7]);
        this.clkDrift = ""; // Helper.parseIntX(fields[8]);
        this.tpGranularity = ""; // Helper.parseIntX(fields[9]);
    }
    parse = function(fields) {
        try {        
            this.utcDateTime = Helper.parseDateTime(fields[3], fields[2]);
            this.utcTow = Helper.parseIntX(fields[4]);
            this.utcWeek = Helper.parseIntX(fields[5]);
            this.leapSec = Helper.parseIntX(fields[6]);
            this.clkBias = Helper.parseIntX(fields[7]);
            this.clkDrift = Helper.parseIntX(fields[8]);
            this.tpGranularity = Helper.parseIntX(fields[9]);
        }
        finally {}
    }
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = UBX04Decoder;