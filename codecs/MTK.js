"use strict";

const Helper = require("../helper.js");

/*
* === MTK - Configuration packet ===
*
* ------------------------------------------------------------------------------
*       1   2 ... n n+1
*       |   |     | |
* $--MTKxxx,a,...,a*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
* 1. Packet type (000-999)
* 2. - n. Data fields; meaning and quantity vary depending on the packet type
* n+1. Checksum
*/
class MTKDecoder {
    constructor() {
        this.sentenceId = "MTK";
        this.sentenceName = "Configuration packet";
        this.packetType = ""; 
    }
    parse = function(fields) {
        try {
            
            this.packetType = Helper.parseIntX(fields[0].Substring(3));
            //this.data = fields.Take(1).Select(Helper.parseNumberOrString().ToArray());
        }
        finally {}            
    }
    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = MTKDecoder;