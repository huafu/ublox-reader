"use strict";

const Helper = require("../helper.js");

/*
* === HDT - Heading - true ===
*
* ------------------------------------------------------------------------------
*        1   2 3
*        |   | |
* $--HDT,x.x,T*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. Heading degrees, true
* 2. T = True
* 3. Checksum
*/
class HDTDecoder { 
    constructor() {
        this.sentenceId = "HDT";
        this.sentenceName = "Heading - true";
        this.heading = "";
    }
    parse = function(fields) {
        try {
            
            this.heading = Helper.parseFloatX(fields[1]);
        }
        finally {}
    }
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = HDTDecoder;