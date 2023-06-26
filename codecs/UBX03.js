"use strict";

const helper = require("../helper.js");

/*
* === UBX03 - Satellite status ===
*/
class Satellite {
    constructor(sid, typ, stat, azi, elev, sig, clt) {
        this.satelliteId = sid;
        this.satelliteType = typ;
        this.status = stat;
        this.azimuth = azi;
        this.elevation = elev;
        this.signalStrength = sig;
        this.carrierLockTime = clt;
    }
}

class UBX03Decoder {
    constructor() {
        this.sentenceId = "UBX03";
        this.sentenceName = "Satellite status"; 
        this.satellites = new Array();
    
    }

    parse = function(fields) {    
        try {
            var numsats = fields[2];
            var offset = 3;
            var sats = new Array(numsats);
            for (var i = 0; i < numsats; i++) {
                var satid = fields[offset];
                this.satellites.push(new Satellite(
                    satid,
                    this.getSatelliteType(satid),
                    fields[offset + 1],
                    helper.parseIntX(fields[offset + 2]),
                    helper.parseIntX(fields[offset + 3]),
                    helper.parseIntX(fields[offset + 4]),
                    helper.parseIntX(fields[offset + 5])));
                offset += 6;
            }
        }
        finally {}
    }
    getJson = function() {
        return helper.outputJson(this);   
    }
        
    getSatelliteType = function(satid) {
        var satstr = "";
        if (satid < 33) {
            satstr = "GPS";
        }
        else if(satid < 65) { // indicates SBAS: WAAS, EGNOS, MSAS, etc.
            satstr = "SBAS";
        }
        else if (satid < 97) { // GLONASS
            satstr = "GLONASS";
        }
        else if (satid >= 120 && satid < 162) { // indicates SBAS: WAAS, EGNOS, MSAS, etc.
            satstr = "SBAS";
        }
        else if (satid > 210) {
            satstr = "GALILEO";
        }
        else {
            satstr = "UNKNOWN";
        }
        return satstr;
    }
}

module.exports = UBX03Decoder;