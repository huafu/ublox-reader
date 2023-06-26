"use strict";

const helper = require("../helper.js");

/*
    * === BWC - Bearing and distance to waypoint - great circle ===
    *
    * ------------------------------------------------------------------------------
    *                                                         12
    *        1         2       3 4        5 6   7 8   9 10  11|    13 14
    *        |         |       | |        | |   | |   | |   | |    |  |
    * $--BEC,hhmmss.ss,llll.ll,a,yyyyy.yy,a,x.x,T,x.x,M,x.x,N,c--c,m,*hh<CR><LF>
    * ------------------------------------------------------------------------------
    *
    * Field Number:
    * 1. UTC time
    * 2. Waypoint Latitude
    * 3. N = North, S = South
    * 4. Waypoint Longitude
    * 5. E = East, W = West
    * 6. Bearing, True
    * 7. T = True
    * 8. Bearing, Magnetic
    * 9. M = Magnetic
    * 10. Nautical Miles
    * 11. N = Nautical Miles
    * 12. Waypoint ID
    * 13. FAA mode indicator (NMEA 2.3 and later, optional)
    * 14. Checksum
    */
class  BWCDecoder { 
    constructor() {
        this.sentenceId = "BWC";
        this.sentenceName = "Bearing and distance to waypoint - great circle";
        this.time = ""; 
        this.bearingLatitude = ""; 
        this.bearingLongitude = ""; 
        this.bearingTrue = ""; 
        this.bearingMagnetic = ""; 
        this.distanceNm = ""; 
        this.waypointId = ""; 
        this.faaMode = ""; 
    }
    
    parse = function(fields) {
        try {
            
            this.time = helper.parseTime(fields[1], "");
            this.bearingLatitude = helper.parseLatitude(fields[2], fields[3]);
            this.bearingLongitude = helper.parseLongitude(fields[4], fields[5]);
            this.bearingTrue = helper.parseFloatX(fields[6]);
            this.bearingMagnetic = helper.parseFloatX(fields[8]);
            this.distanceNm = helper.parseFloatX(fields[10]);
            this.waypointId = fields[12];
            this.faaMode = fields[13];
        }
        finally {}
    }
    
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = BWCDecoder;
