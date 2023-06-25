"use strict";

const Helper = require("../Helper.js");

class HNRPVTDecoder {
    constructor() {
        this.iTOW;
        this.year;
        this.month;
        this.day;
        this.hour;
        this.minute;
        this.sec;
        this.valid;
        this.nano;
        this.gpsFix;
        this.flags;
        this.reserved1;
        this.lon;
        this.lat;
        this.htGPS;
        this.htMSL;
        this.speedGnd;
        this.speed3D;
        this.headMot;
        this.headVeh;
        this.hAcc;
        this.vAcc;
        this.sAcc;
        this.headAcc;
        this.reserved2;
    }
        
    parse = function(fielddata) {
        // TODO: decode fielddata into properties
        this.fielddata = fielddata;
    }

    getJson = function() {
        return Helper.outputJson(this);   
    }
}

module.exports = HNRPVTDecoder;