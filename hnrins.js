"use strict";

const Helper = require("./Helper.js");

class HNRINS {
    constructor() {
        this.iTOW = 0;
        this.version = 0;
        this.reserved = 0;
        this.pitch = 0;
        this.heading = 0;
        this.accRoll = 0;
        this.accPitch = 0;
        this.accHeading = 0;
    }

    load = function(fielddata) {
        // TODO: decode fielddata into properties
        Helper.outputJson(Buffer.from(fielddata).toJSON());
    }
}

module.exports = HNRINS;