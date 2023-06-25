"use strict";

const Helper = require("../helper.js");
var UBX00Decoder = require("./UBX00.js");
var UBX03Decoder = require("./UBX03.js");
var UBX04Decoder = require("./UBX04.js");

// Wrapper class for UBX00, UBX03, UBX04
class UBXDecoder {
    constructor() {
        this.sentenceId = "UBX";
        this.pid = "";
        this.jsonout = {};
        this.UBX00Decoder = new UBX00Decoder();
        this.UBX03Decoder = new UBX03Decoder();
        this.UBX04Decoder = new UBX04Decoder();
    }
    parse = function(fields) {
        this.pid = Helper.parseIntX(fields[1]);
        switch (this.pid) {
            case 0:
                this.UBX00Decoder.parse(fields);
                this.jsonout = this.UBX00Decoder.getJson();
                break;
            case 3:
                this.UBX03Decoder.parse(fields);
                this.jsonout = this.UBX03Decoder.getJson();
                break;
            case 4:
                this.UBX04Decoder.parse(fields);
                this.jsonout = this.UBX04Decoder.getJson();
                break;
            default:
                console.log("UBX UNKNOWN", fields);
        }
    }
    getJson = function() {
        return this.jsonout;
    }
}

module.exports = UBXDecoder;