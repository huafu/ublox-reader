"use strict";

const { SerialPort } = require('serialport');
const { WebSocketServer } = require("ws");
const http = require("http");
const express = require("express");
const favicon = require('serve-favicon');
const configurator = require("./configurator.js");
const settings = require("./settings.js");
const { networkInterfaces } = require('os');

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
const decoders = {};
const connections = {};

var port = undefined;
var timerid = 0;
var sip = getServerIPAddress(); 

const loadDecoders = function() {
    decoders["DTM"] = new DTMDecoder();
    decoders["GBS"] = new GBSDecoder();
    decoders["GGA"] = new GGADecoder();
    decoders["GLL"] = new GLLDecoder();
    decoders["GNS"] = new GNSDecoder();
    decoders["GRS"] = new GRSDecoder();
    decoders["GSA"] = new GSADecoder();
    decoders["GST"] = new GSTDecoder();
    decoders["GSV"] = new GSVDecoder();
    decoders["RMC"] = new RMCDecoder();
    decoders["TXT"] = new TXTDecoder();
    decoders["VLW"] = new VLWDecoder();
    decoders["VTG"] = new VTGDecoder();
    decoders["ZDA"] = new ZDADecoder();
    decoders["UBX00"] = new UBX00Decoder();
    decoders["UBX03"] = new UBX03Decoder();
    decoders["UBX04"] = new UBX04Decoder();
}

loadDecoders();
runServers();

function getServerIPAddress() {
    const nets = networkInterfaces();
    const results = new Array();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                results.push(net.address);
            }
        }
    }
    console.log(`Server IP address: ${results[0]}`);
    return results[0];
}

function runSerialConnectionTimer() {
    timerid = setInterval(function(){
        console.log("checking for u-blox GPS dongle");
        connectUblox();
    }, 3000);
}

function connectUblox() {
    let baudrate = settings.baudrate;
    let device;
    
    if (settings.isdocker) {
        device = settings.device; 
        setupSerialDevice(device, baudrate);
    }
    else {
        SerialPort.list().then(list => {
            for (var i = 0; i < list.length; i++) {
                device = getDeviceInfo(list[i]);
                if (device.isublox) {
                    setupSerialDevice(device, baudrate);
                    break;
                }
            }
        },
        err => {
            console.log(err);
        });
    }
}

const setupSerialDevice = function(device, baudrate) {
    console.log(device);
    port = new SerialPort({ path: device.path, baudRate: baudrate, autoOpen: false });
    port.open();
    port.on('open', function() {
        console.log(port);
        configurator.writeConfig(port, device.pid);
        clearInterval(timerid);
        selectMessages(JSON.parse(settings.initialization));
    }); 
    port.on('readable', function() {
        runParsing(port);
    });
    port.on('close', function() {
        sendDataToBrowser("disconnect","SERIAL PORT DISCONNECTED!\r\n\r\nThe application will attempt reconnection...")
        runSerialConnectionTimer();
    });
}

function runParsing() {
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
            if (sd.sentenceId === "UBX") {
                sd.sentenceId += sd.fields[1]; 
            }
            var decoder = decoders[sd.sentenceId];
            if (decoder !== undefined) {
                decoder.parse(sd.fields);
                sendDataToBrowser("data", decoder.getJson());
                if (settings.outputconsole) console.log(decoder.getJson());
            }
        }
    }
}

function getDeviceInfo(portjson){
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

function selectMessages(data) {
    var list = data["list"];
    var rate = data["navrate"];
    list.forEach((item) => {
        console.log(item);
        var decoder = decoders[item[0]];
        var enabled = item[1];
        configurator.setMessageEnabled(decoder.cid, decoder.mid, enabled);
    });
    configurator.setNavRate(rate);
}

function runServers() {
    var server = http.createServer();
    var wss = new WebSocketServer({ server });
    server.listen(settings.wsport, () => {});
    runSerialConnectionTimer();
    console.log(`Data forwarding websocket server established on port ${settings.wsport}`); 

    wss.on("connection", (wsconn) => {
        const id = Date.now();
        connections[id] = wsconn;
        if (port !== undefined) {
            sendDataToBrowser("gpssuccess", "Connected to server... select desired message(s) to monitor");
        }
        else {
            sendDataToBrowser("gpsfailure","No U-blox gps device present on any serial port.\r\n\r\n" +
                              "The application will keep attempting to recover until a U-blox\r\n" +
                              "device is detected and messages will then be sent to the browser."); 
        }
        wsconn.on("close", function () {
            console.log("connection closed");
            for(let id in connections) {
                let cn = connections[id];
                if (cn === wsconn) {
                    delete connections[id];
                    break;
                }
            }
        });
        wsconn.on("message", (message) => { 
            var data = message.toString();
            settings.initialization = data;
            selectMessages(JSON.parse(data));
        });
    });

    var app = express();
    try {
        app.use(express.urlencoded({ extended: true }));
        app.listen(settings.httpport, () => {
            console.log(`Http web server is listening on port ${settings.httpport}`);
        });
        
        var options = {
            dotfiles: 'ignore',
            etag: false,
            extensions: ['html'],
            index: false,
            redirect: false,
            setHeaders: function (res, path, stat) {
                res.set('x-timestamp', Date.now());
            }
        };

        app.use(express.static(`${__dirname}/public`, options));
        app.use(favicon(`${__dirname}/public/favicon.ico`));

        app.get('/',(req, res) => {
            res.sendFile(`${__dirname}/public/index.html`);
        });

        app.get('/wsurl',(req, res) => {
            let wsdata = `ws://${sip}:${settings.wsport}`;
            res.send(wsdata);
        });
    }
    catch (error) {
        console.log(error);
    }
}

function sendDataToBrowser(msgprefix, data) {
    let msg = JSON.stringify({"prefix": msgprefix, "payload": data});
    console.log(`Sending data from ${sip}`);
    try {
        for(let id in connections) {
            connections[id].send(msg);
        };
    }
    finally{}
}

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
    isValid = function () {
        return this.sentenceId.length > 1;
    };
}

String.prototype.toBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
    }
    return bytes;
};
