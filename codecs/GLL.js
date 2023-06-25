"use strict";

const Helper = require("../helper.js");


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
        this.sentenceId = "GLL";
        this.sentenceName = "Geographic position - latitude and longitude";
        this.latitude = ""; // Helper.parseLatitude(fields[1], fields[2]);
        this.longitude = ""; // Helper.parseLongitude(fields[3], fields[4]);
        this.time = ""; // Helper.parseTime(fields[5], "");
        this.status = ""; // fields[6] == "A" ? "valid" : "invalid";
        this.faaMode = ""; // fields[7];
    }
    parse = function(fields) {
        try {
            
            this.latitude = Helper.parseLatitude(fields[1], fields[2]);
            this.longitude = Helper.parseLongitude(fields[3], fields[4]);
            this.time = Helper.parseTime(fields[5], "");
            this.status = fields[6] == "A" ? "valid" : "invalid";
            this.faaMode = fields[7];
        }
        finally {}
    }
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = GLLDecoder;