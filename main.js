"use strict";

const { SerialPort } = require('serialport');
const { SerialData } = require('./serialdata.js');

const settings = require("./settings.js");
const helper = require("./helper.js")
const webserver = require("./server.js");
const configurator = require("./configurator.js");

const DTMDecoder = require("./codecs/DTM.js");
const GBSDecoder = require("./codecs/GBS.js");
const GRSDecoder = require("./codecs/GRS.js");
const GGADecoder = require("./codecs/GGA.js");
const GLLDecoder = require("./codecs/GLL.js");
const GNSDecoder = require("./codecs/GNS.js");
const GSADecoder = require("./codecs/GSA.js");
const GSTDecoder = require("./codecs/GST.js");
const GSVDecoder = require("./codecs/GSV.js");
const RMCDecoder = require("./codecs/RMC.js");
const TXTDecoder = require("./codecs/TXT.js");
const VLWDecoder = require("./codecs/VLW.js");
const VTGDecoder = require("./codecs/VTG.js");
const ZDADecoder = require("./codecs/ZDA.js");
const UBX00Decoder = require("./codecs/UBX00.js");
const UBX03Decoder = require("./codecs/UBX03.js");
const UBX04Decoder = require("./codecs/UBX04.js");

var decoders = new Map();
var selectedMessages = {};

const loadDecoders = function() {
    decoders.set("DTM", new DTMDecoder());
    decoders.set("GBS", new GBSDecoder());
    decoders.set("GGA", new GGADecoder());
    decoders.set("GLL", new GLLDecoder());
    decoders.set("GNS", new GNSDecoder());
    decoders.set("GRS", new GRSDecoder());
    decoders.set("GSA", new GSADecoder());
    decoders.set("GST", new GSTDecoder());
    decoders.set("GSV", new GSVDecoder());
    decoders.set("RMC", new RMCDecoder());
    decoders.set("TXT", new TXTDecoder());
    decoders.set("VLW", new VLWDecoder());
    decoders.set("VTG", new VTGDecoder());
    decoders.set("ZDA", new ZDADecoder());
    decoders.set("UBX00", new UBX00Decoder());
    decoders.set("UBX03", new UBX03Decoder());
    decoders.set("UBX04", new UBX04Decoder());
}

mainFunction();

function mainFunction() {

    loadDecoders();

    webserver.runServers();

    let baudrate = settings.baudrate;
    let port; 
    let device;
    
    SerialPort.list().then(list => {
        for (var i = 0; i < list.length; i++) {
            device = getDeviceInfo(list[i]);
            if (device.isublox) {
                console.log(device);
                port = new SerialPort({ path: device.path, baudRate: baudrate, autoOpen: false });
                port.open();
                port.on('open', function() {
                    console.log(port);
                    //const cfg = new Configurator();
                    configurator.writeConfig(port, device.pid);
                }); 
                port.on('readable', function() {
                    runParsing(port);
                });
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
        let hdr0 = buffer[0];
        let hdr1 = buffer[1]; 
        if (hdr0 === 0x24 && ( hdr1 === 0x47 || hdr1 === 0x50)) { 
            // we have a NMEA message, read to CRLF
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
            if (decoder !== undefined) {
                decoder.parse(sd.fields);
                sendMessage(decoder);
                if (settings.outputconsole) console.log(decoder.getJson());
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
    0x01a4 Antaris 4
    0x01a5 u-blox 5
    0x01a6 u-blox 6
    0x01a7 u-blox 7
    0x01a8 u-blox 8
    0x1102 LISA-U2
*/
    let outjson = {"isublox": false, "path": "", "pid": ""};
    let pid = "";
    if (portjson.productId !== undefined) {
        try {
            // force lower case on hex strings for interoperability
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
                // u-blox device found on this serial port
                outjson.isublox = true;
                outjson.path = portjson.path;
                outjson.pid = pid;    
            }
        }
        finally {}
    }
    return outjson;
}

const sendMessage = function(decoder) {
    if (selectedMessages[decoder.sentenceId] !== undefined) {
        webserver.sendDataToBrowser(decoder.getJson());
    } 
}

exports.selectMessages = function(data) {
    selectedMessages = data;
    decoders.forEach((decoder, key) => {
        var enabled = false;
        if (selectedMessages[key] !== undefined) {
            enabled = true;
        }
        configurator.setMessageEnabled(decoder.cid, decoder.mid, enabled);
        console.log(`${decoder.sentenceId} enabled: ${enabled}`)
    });
}