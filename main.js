"use strict";

const fs = require('fs');
const { SerialPort } = require('serialport');

var APBDecoder = require("./codecs/APB.js");
var BWCDecoder = require("./codecs/BWC.js");
var DBTDecoder = require("./codecs/DBT.js");
var DTMDecoder = require("./codecs/DTM.js");
var GGADecoder = require("./codecs/GGA.js");
var GLLDecoder = require("./codecs/GLL.js");
var GNSDecoder = require("./codecs/GNS.js");
var GSADecoder = require("./codecs/GSA.js");
var GSTDecoder = require("./codecs/GST.js");
var GSVDecoder = require("./codecs/GSV.js");
var HDGDecoder = require("./codecs/HDG.js");
var HDMDecoder = require("./codecs/HDM.js");
var HDTDecoder = require("./codecs/HDT.js");
var MTKDecoder = require("./codecs/MTK.js");
var MWVDecoder = require("./codecs/MWV.js");
var RDIDecoder = require("./codecs/RDI.js");
var RMCDecoder = require("./codecs/RMC.js");
var TXTDecoder = require("./codecs/TXT.js");
var UBXDecoder = require("./codecs/UBX.js");
var VHWDecoder = require("./codecs/VHW.js");
var VTGDecoder = require("./codecs/VTG.js");
var ZDADecoder = require("./codecs/ZDA.js");
var Configurator = require("./Configurator.js");

var settings = JSON.parse(fs.readFileSync(`${__dirname}/settings.json`));

class SerialData {
    constructor(sentence = "") {
        this.sentence = sentence;
        this.fields = [];
        this.sentenceId = "";

        if (!this.sentence.startsWith("$")) {
            this.fields = [""];
            this.sentenceId = "";
        }
        else {
            if (this.sentence.startsWith("$PUB")) {
                this.fields = this.sentence.substring(2, this.sentence.length - 2).split(",");
            }
            else {
                this.fields = this.sentence.substring(3, this.sentence.length - 3).split(",");
            }
            this.sentenceId = this.fields[0];
        }
    }
    isValid = function() { 
        return this.sentenceId.length > 1;
    }
}


var decoders = new Map();
decoders.set("APB", new APBDecoder());
decoders.set("BWC", new BWCDecoder());
decoders.set("DBT", new DBTDecoder());
decoders.set("DTM", new DTMDecoder());
decoders.set("GGA", new GGADecoder());
decoders.set("GLL", new GLLDecoder());
decoders.set("GNS", new GNSDecoder());
decoders.set("GSA", new GSADecoder());
decoders.set("GST", new GSTDecoder());
decoders.set("GSV", new GSVDecoder());
decoders.set("HDG", new HDGDecoder());
decoders.set("HDM", new HDMDecoder());
decoders.set("HDT", new HDTDecoder());
decoders.set("MTK", new MTKDecoder());
decoders.set("MWV", new MWVDecoder());
decoders.set("RDI", new RDIDecoder());
decoders.set("RMC", new RMCDecoder());
decoders.set("TXT", new TXTDecoder());
decoders.set("UBX", new UBXDecoder());
decoders.set("VHW", new VHWDecoder());
decoders.set("VTG", new VTGDecoder());
decoders.set("ZDA", new ZDADecoder());

mainFunction();

function mainFunction() {
    let baudrate = settings.baudrate;
    let port; 
    let device;

    const open = function() {
        console.log(port);
        var cfg = new Configurator();
        cfg.writeConfig(port, device.pid, settings);
    };

    const readable = function () {
       runParsing(port)
    };
    
    SerialPort.list().then(list => {
        for (var i = 0; i < list.length; i++) {
            device = getDeviceInfo(list[i]);
            if (device.isublox) {
                console.log(device);
                port = new SerialPort({ path: device.path, baudRate: baudrate, autoOpen: false });
                port.open();
                port.on('open', open);
                port.on('readable', readable);
                break;
            }
        }
    },
    err => {
        console.log(err);
    });
}

function runParsing(port) {
    let buffer = port.read();
    if (buffer !== null) {
        if (buffer[0] === 0xB5 && buffer[1] === 0x62) {
            // we have a UBX message, see if its HNR
            if (buffer[2] === 0x28) {
                let id = buffer[3];
                let hb = buffer[4];
                let lb = buffer[5];
                let msglen = (((hb & 0xFF) << 8) | (lb & 0xFF));
                let msgbuffer = new Buffer.alloc(msglen);
                buffer.copy(msgbuffer, 0, 6); 
                if (id === 0x01) { // HNR-ATT
                    console.log("HNR-ATT: ", msgbuffer);
                }
                else if (id === 0x02) { // HNR-INS
                    console.log("HNR-INS: ", msgbuffer);
                }
                else if (id === 0x00) { // HNR-PVT
                    console.log("HNR-PVT: ", msgbuffer);
                }
            }
        }
        else {
            let ch0 = buffer[0];
            let ch1 = buffer[1]; 
            if (ch0 === 36 && ( ch1 === 71 || ch1 === 80)) { 
                // we have a NMEA message, read to CRLF
                //let done = false;
                let msg = new Array();
                for (var x = 0; x < buffer.length; x++) {
                    let tb = buffer[x];
                        if (tb === 0x0D) { // carriage return
                            let lf = buffer[x+1];
                                if (lf === 0x0A) { // linefeed
                                    break;  
                            }
                        }
                        else {
                            msg.push(tb);
                        }
                }
                var line = Buffer.from(msg).toString();
                var sd = new SerialData(line);
                var decoder = decoders.get(sd.sentenceId);
                decoder.parse(sd.fields);
                console.log(decoder.getJson());
            }
        }
    }
}

String.prototype.toBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
    }
    return bytes;
};

const getDeviceInfo = function(portjson){
/* u-blox device codes
    ----------------------------------
    MANUFACTURER ID = 0x1546 U-Blox AG 
    -----------------------------------
    0x01A4 Antaris 4
    0x01A5 u-blox 5
    0x01A6 u-blox 6
    0x01A7 u-blox 7
    0x01A8 u-blox 8
    0x1102 LISA-U2
*/
    let outjson = {"isublox": false, "path": "", "pid": ""};
    let pid = "";
    if (portjson.productId !== undefined) {
        try {
            switch (portjson.productId.toLowerCase()) {
                case "01a4":
                    pid = "Antaris4";
                    break;
                case "01a5":
                    pid = "u-blox5"
                    break;
                case "01a6":
                    pid = "u-blox6"
                    break;
                case "01a7":
                    pid = "u-blox7"
                    break;
                case "01a8":
                    pid = "u-blox8"
                    break;
            }
            if (portjson.vendorId === "1546") {
                // we have a u-blox device on this com port!
                outjson.isublox = true;
                outjson.path = portjson.path;
                outjson.pid = pid;    
            }
        }
        finally {}
    }
    return outjson;
}