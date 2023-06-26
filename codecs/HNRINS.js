"use strict";

const helper = require("../helper.js");

class HNRINSDecoder {
    constructor() {
        this.sentenceId = "HNRINS";
        this.iTOW = 0;
        this.version = 0;
        this.reserved = 0;
        this.pitch = 0;
        this.heading = 0;
        this.accRoll = 0;
        this.accPitch = 0;
        this.accHeading = 0;
    }

    parse = function(fielddata) {
        // TODO: decode fielddata into properties
        this.fielddata = fielddata;
    }

    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = HNRINSDecoder;