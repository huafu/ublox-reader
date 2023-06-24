"use strict";

const Helper = require("./Helper.js");

class HNRPVT {
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
        
    load = function(fielddata) {
        // TODO: decode fielddata into properties
        Helper.outputJson(Buffer.from(fielddata).toJSON());

    }
}

module.exports = HNRPVT;
