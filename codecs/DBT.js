"use strict";

const helper = require("../helper.js");

/*
    * === DBT - Depth below transducer ===
    *
    * ------------------------------------------------------------------------------
    *        1   2 3   4 5   6 7
    *        |   | |   | |   | |
    * $--DBT,x.x,f,x.x,M,x.x,F*hh<CR><LF>
    * ------------------------------------------------------------------------------
    *
    * Field Number:
    * 1. Depth, feet
    * 2. f = feet
    * 3. Depth, meters
    * 4. M = meters
    * 5. Depth, Fathoms
    * 6. F = Fathoms
    * 7. Checksum
*/
class DBTDecoder {
    constructor() {
        this.sentenceId = "DBT";
        this.sentenceName = "Depth below transducer";
        this.depthFeet = ""; 
        this.depthMeters = ""; 
        this.depthFathoms = ""; 
    }    
    parse = function(fields) {
        try {
            this.depthFeet = helper.parseFloatX(fields[1]);
            this.depthMeters = helper.parseFloatX(fields[3]);
            this.depthFathoms = helper.parseFloatX(fields[5]);
        }
        finally {}
    }    
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = DBTDecoder;