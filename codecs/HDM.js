"use strict";

const helper = require("../helper.js");

/*
* === HDM - Heading - magnetic ===
*
* ------------------------------------------------------------------------------
*        1   2 3
*        |   | |
* $--HDM,x.x,M*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. Heading degrees, magnetic
* 2. M = Magnetic
* 3. Checksum
*/

class HDMDecoder  {
    constructor() {
        this.sentenceId = "HDM";
        this.sentenceName = "Heading - magnetic"; 
        this.heading = ""; 
    }
    parse = function(fields) {
        try {
            this.heading = helper.parseFloatX(fields[1]);    
        }
        finally {}    
    }
    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = HDMDecoder;