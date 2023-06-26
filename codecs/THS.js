"use strict";

const helper = require("../helper.js");
/*
* === THS - True heading and status ===
*
* ------------------------------------------------------------------------------
*         1 2 3  4  5  6  7   8  9  10 11  12 13 14 15  16 17 18 19  20 21
*         | | |  |  |  |  |   |  |  |  |   |  |  |  |   |  |  |  |   |  |
*  $--GSA,x,x,xx,xx,xx,xx,xxx,xx,xx,xx,xxx,xx,xx,xx,xxx,xx,xx,xx,xxx,xx*hh<CR><LF>
* ------------------------------------------------------------------------------
*
* Field Number:
*
* 1. Number of sentences for full data
* 2. Sentence number out of total
* 3. Number of satellites in view
* 4. PRN of satellite used for fix (may be blank)
*
* 5. Satellite PRN number     \
* 6. Elevation, degrees       +- Satellite 1
* 7. Azimuth, degrees         |
* 8. Signal to noise ratio    /
*
* 9. Satellite PRN number     \
* 10. Elevation, degrees      +- Satellite 2
* 11. Azimuth, degrees        |
* 12. Signal to noise ratio   /
*
* 13. Satellite PRN number    \
* 14. Elevation, degrees      +- Satellite 3
* 15. Azimuth, degrees        |
* 16. Signal to noise ratio   /
*
* 17. Satellite PRN number    \
* 18. Elevation, degrees      +- Satellite 4
* 19. Azimuth, degrees        |
* 20. Signal to noise ratio   /
*
* 21. Checksum
*/

class THSDecoder {
    constructor() {
        // message configuration bytes:  CLASS   ID   I2C  UART1 UART2  USB   SPI  RESERVED
        //----------------------------------------------------------------------------------
        //                       byte#:    0     1     2     3     4     5     6     7 
        this.msgconfig = new Uint8Array([0xF0, 0x0E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        this.sentenceId = "THS";
        this.sentenceName = "True heading and status"; 
        this.headt = 0;
        this.mi = "";
    }

    parse = function(fields) {
        try {
            this.headt = helper.parseFloatX(fields[1]);
            switch (fields[2]) {
                case "A":
                    this.mi = "Autonomous"; 
                    break;
                case "E":
                    this.mi = "Estimated";  
                    break;
                case "M":
                    this.mi = "Manual input";
                    break;
                case "S":
                    this.mi = "Simulator";
                    break;
                case "V":
                    this.mi = "Data not valid";
                    break;
            }
        }
        finally {}
    }

    subscribe = function(enable) {
        if (enable) {
            this.msgconfig[5] = 0x01;
        }
        else {
            this.msgconfig[5] = 0x00;
        }
    }

    getJson = function() {
        return helper.outputJson(this);   
    }
}

module.exports = THSDecoder;