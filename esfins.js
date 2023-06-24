"use strict";

class EFSINS {
    constructor() {
        this.bitfield;
        this.reserved;
        this.iTOW;
        this.xAngRate;
        this.yAngRate;
        this.zAngRate;
        this.xAccel;
        this.yAccel;
        this.zAccel;
    }

    load = function(fielddata) {
        // TODO: decode fielddata into properties
        //var bf = Convert.toString(this.bitfield, 2);
        var xa = (this.xAccel * .0001).toString("0.###");
        var ya = (this.yAccel * .0001).toString("0.###");
        var za = (this.zAccel * .0001).toString("0.###");

        var xr = (this.xAngRate * .001).toString("0.##");
        var yr = (this.yAngRate * .001).toString("0.##");
        var zr = (this.zAngRate * .001).toString("0.##");
    }
}

module.exports = EFSINS;