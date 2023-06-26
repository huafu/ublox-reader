"use strict";

const helper = require("../helper.js");

/*
* === PRDID - RDI proprietary heading, pitch, and roll ===
*
* ------------------------------------------------------------------------------
*        1   2   3   4
*        |   |   |   |
* $PRDID,x.x,x.x,x.x*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. Roll
* 2. Pitch
* 3. Heading
* 4. Checksum
*/

class RDIDecoder { 
    constructor() {
        this.sentenceId = "RDI";
        this.sentenceName = "RDI proprietary heading, pitch, and roll";
        this.roll = "";
        this.pitch = "";
        this.heading = "";
    }
    parse = function(fields) {
        try {
            
            this.roll = helper.parseFloatX(fields[1]);
            this.pitch = helper.parseFloatX(fields[2]);
            this.heading = helper.parseFloatX(fields[3]);
        }
        finally {}
    }
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = RDIDecoder;