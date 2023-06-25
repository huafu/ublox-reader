"use strict";

const Helper = require("../helper.js");

/*
    * === APB - Autopilot Sentence "B" ===
    *
    * ------------------------------------------------------------------------------
    *                                         13    15
    *        1 2 3   4 5 6 7 8   9 10   11  12|   14|
    *        | | |   | | | | |   | |    |   | |   | |
    * $--APB,A,A,x.x,a,N,A,A,x.x,a,c--c,x.x,a,x.x,a*hh<CR><LF>
    * ------------------------------------------------------------------------------
    *
    * Field Number:
    * 1. Status
    *    V = LORAN-C Blink or SNR warning
    *    V = general warning flag or other navigation systems when a reliable
    *        fix is not available
    * 2. Status
    *    V = Loran-C Cycle Lock warning flag
    *    A = OK or not used
    * 3. Cross Track Error Magnitude
    * 4. Direction to steer, L or R
    * 5. Cross Track Units, N = Nautical Miles
    * 6. Status
    *    A = Arrival Circle Entered
    * 7. Status
    *    A = Perpendicular passed at waypoint
    * 8. Bearing origin to destination
    * 9. M = Magnetic, T = True
    * 10. Destination Waypoint ID
    * 11. Bearing, present position to Destination
    * 12. M = Magnetic, T = True
    * 13. Heading to steer to destination waypoint
    * 14. M = Magnetic, T = True
    * 15. Checksum
    */ 
class APBDecoder { 
    constructor() {
        this.sentenceId = "APB";
        this.sentenceName = "Autopilot sentence \"B\"";
        this.status1 = ""; // fields[1];
        this.status2 =  ""; // fields[2];
        this.xteMagn = ""; // Helper.parseFloatX(fields[3]);
        this.steerDir = ""; // fields[4];
        this.xteUnit = ""; // fields[5];
        this.arrivalCircleStatus = ""; // fields[6];
        this.arrivalPerpendicularStatus = ""; // fields[7];
        this.bearingOrig2Dest = ""; // Helper.parseFloatX(fields[8]);
        this.bearingOrig2DestType = ""; // fields[9];
        this.waypoint = ""; // fields[10];
        this.bearing2Dest = ""; // Helper.parseFloatX(fields[11]);
        this.bearingDestType = ""; // fields[12];
        this.heading2steer = ""; // Helper.parseFloatX(fields[13]);
        this.headingDestType = ""; // fields[14];
    }
    
    parse = function(fields) {
        try {     
            this.status1 =  fields[1];
            this.status2 =  fields[2];
            this.xteMagn = Helper.parseFloatX(fields[3]);
            this.steerDir = fields[4];
            this.xteUnit = fields[5];
            this.arrivalCircleStatus = fields[6];
            this.arrivalPerpendicularStatus = fields[7];
            this.bearingOrig2Dest = Helper.parseFloatX(fields[8]);
            this.bearingOrig2DestType = fields[9];
            this.waypoint = fields[10];
            this.bearing2Dest = Helper.parseFloatX(fields[11]);
            this.bearingDestType = fields[12];
            this.heading2steer = Helper.parseFloatX(fields[13]);
            this.headingDestType = fields[14];
        }
        finally {}
    }
    
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = APBDecoder;