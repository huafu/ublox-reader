"use strict";

const helper = require("../helper.js");

/*
* === ZDA - Time & Date - UTC, day, month, year and local time zone ===
*
* ------------------------------------------------------------------------------
*	      1         2  3  4    5  6  7
*        |         |  |  |    |  |  |
* $--ZDA,hhmmss.ss,dd,mm,yyyy,zz,zz*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. UTC time (hours, minutes, seconds, may have fractional subsecond)
* 2. Day, 01 to 31
* 3. Month, 01 to 12
* 4. Year (4 digits)
* 5. Local zone description, 00 to +- 13 hours
* 6. Local zone minutes description, 00 to 59, apply same sign as local hours
* 7. Checksum
*/

class ZDADecoder {
    constructor() {
        this.sentenceId = "ZDA";
        this.sentenceName = "UTC, day, month, year, and local time zone";
        this.datetime = ""; 
        this.localZoneHours = ""; 
        this.localZoneMinutes = ""; 
    }

    parse = function(fields) {
        try {
            this.datetime = helper.parseTime(fields[1], ""); 
            this.localZoneHours = helper.parseIntX(fields[5]);
            this.localZoneMinutes = helper.parseIntX(fields[6]);
        }
        finally {}
    }
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = ZDADecoder;