"use strict";

const { SerialPort } = require('serialport');
const { SerialData } = require('./serialdata.js');

const settings = require("./settings.js");
const helper = require("./helper.js")
const webserver = require("./server.js");

const APBDecoder = require("./codecs/APB.js");
const BWCDecoder = require("./codecs/BWC.js");
const DBTDecoder = require("./codecs/DBT.js");
const DTMDecoder = require("./codecs/DTM.js");
const GGADecoder = require("./codecs/GGA.js");
const GLLDecoder = require("./codecs/GLL.js");
const GNSDecoder = require("./codecs/GNS.js");
const GSADecoder = require("./codecs/GSA.js");
const GSTDecoder = require("./codecs/GST.js");
const GSVDecoder = require("./codecs/GSV.js");
const HDGDecoder = require("./codecs/HDG.js");
const HDMDecoder = require("./codecs/HDM.js");
const HDTDecoder = require("./codecs/HDT.js");
const MTKDecoder = require("./codecs/MTK.js");
const MWVDecoder = require("./codecs/MWV.js");
const RDIDecoder = require("./codecs/RDI.js");
const RMCDecoder = require("./codecs/RMC.js");
const TXTDecoder = require("./codecs/TXT.js");
const UBXDecoder = require("./codecs/UBX.js");
const VHWDecoder = require("./codecs/VHW.js");
const VTGDecoder = require("./codecs/VTG.js");
const ZDADecoder = require("./codecs/ZDA.js");
const HNRATTDecoder = require('./codecs/HNRATT.js');
const HNRPVTDecoder = require('./codecs/HNRPVT.js');
const HNRINSDecoder = require('./codecs/HNRINS.js');
const Configurator = require("./configurator.js");

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
decoders.set("HNRATT", new HNRATTDecoder());
decoders.set("HNRINS", new HNRINSDecoder());
decoders.set("HNRPVT", new HNRPVTDecoder());

var selectedMessages = {};

mainFunction();

function mainFunction() {

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
                    const cfg = new Configurator();
                    cfg.writeConfig(port, device.pid);
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
            decoder.parse(sd.fields);
            sendMessage(decoder);
            if (settings.outputconsole) console.log(decoder.getJson());
        }
        else if (hdr0 === 0xB5 && hdr1 === 0x62) {
            // we have a UBX accelerometer message
            if (buffer[2] === 0x28) { // HNR message
                let id = buffer[3];
                let hibyte = buffer[4];
                let lowbyte = buffer[5];
                let msglen = helper.parseUInt16(hibyte, lowbyte);
                let msgbuffer = new Buffer.alloc(msglen);
                buffer.copy(msgbuffer, 0, buffer.length - 2); 
                if (id === 0x01) { // HNR-ATT
                    var decoder = decoders.get("HNRATT");
                    decoder.parse(msgbuffer);
                    sendMessage(decoder);
                    if (settings.outputconsole) console.log("HNR-ATT", decoder.getJson());
                }
                else if (id === 0x02) { // HNR-INS
                    var decoder = decoders.get("HNRINS");
                    decoder.parse(msgbuffer);
                    sendMessage(decoder);
                    if (settings.outputconsole) console.log("HNR-INS: ", decoder.getJson());
                }
                else if (id === 0x00) { // HNR-PVT
                    var decoder = decoders.get("HNRPVT");
                    decoder.parse(msgbuffer);
                    sendMessage(decoder);
                    if (settings.outputconsole) console.log("HNR-PVT: ", decoder.getJson());
                }
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
                // we have a u-blox device on this serial port!
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
    Object.entries(selectedMessages).forEach((entry) => {
        const [key, value] = entry;
        console.log(`${key}: ${value}`);
    });
}