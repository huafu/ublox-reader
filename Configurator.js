"use strict";

const settings =  require("./settings.js");

var serialPort = "";
var pid = "";
var baudRate = 9600;
var navRate = 2;

exports.writeConfig = function(port, prid) {
    serialPort = port;
    baudRate = settings.baudrate;
    navRate = settings.navrate;
    pid = prid;
    
    switch (pid) {
        case "u-blox6":
        case "u-blox7":
            writeUblox7ConfigCommands();
            break;
        case "u-blox8":
            writeUblox8ConfigCommands();
            break;
        case "u-blox9":
            writeUblox9ConfigCommands();
            break;
        default:
            throw(new Exception("Invalid UBLOX pid. Cannot continue."));
    }
    
    writeUbloxGenericConfigCommands();
}
	
const writeUbloxGenericConfigCommands = function() {
    // Turn off "time pulse" (usually drives an LED).
    var tp5 = new Uint8Array(32); 
    tp5[1] = 0x01;  
    tp5[4] = 0x32; 
    tp5[8] = 0x40;
    tp5[9] = 0x42;
    tp5[10] = 0x0F;
    tp5[12] = 0x40;
    tp5[13] = 0x42;
    tp5[14] = 0x0F;
    tp5[28] = 0xE7;
    
    serialPortWrite(makeUBXCFG(0x06, 0x31, 32, tp5));

    // UBX-CFG-NMEA (change NMEA protocol version to 4.0 extended)
    serialPortWrite(makeUBXCFG(0x06, 0x17, 20, new Uint8Array([0x00, 0x40, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 
                                                               0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));

    // UBX-CFG-PMS
    serialPortWrite(makeUBXCFG(0x06, 0x86, 8, new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));   // Full Power Mode
    // serialPortWrite(makeUBXCFG(0x06, 0x86, 8, new Uint8Array([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00})) // Balanced Power Mode

    // UBX-CFG-NAV5 
    // Dynamic platform model: airborne with <2g acceleration
    serialPortWrite(makeUBXCFG(0x06, 0x24, 36, new Uint8Array([0x01, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
                                                               0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
                                                               0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); 

    // UBX-CFG-SBAS (disable integrity, enable auto-scan)
    serialPortWrite(makeUBXCFG(0x06, 0x16, 8, new Uint8Array([0x01, 0x03, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00])));

    // UBX-CFG-HNR set to 5hz
    serialPortWrite(makeUBXCFG(0x06, 0x5C, 4, new Uint8Array([0x05, 0x00, 0x00, 0x00])));
    
    //UBX-CFG-MSG setup UBX-HNR-PVT, UBX-HNR-ATT, ESF-INS messages
    //                              	                                   CLASS  ID   I2C  UART1 UART2  USB   SPI   RESERVED
    //                            	    	                               -------------------------------------------------- 
    if (settings.hnrmessages) {
        serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x28, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]))); // HNR-PVT ON
        serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x28, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]))); // HNR-ATT ON
        serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x10, 0x15, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]))); // HNR-INS ON
    }
    else {
        serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x28, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // HNR-PVT OFF
        serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x28, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // HNR-ATT OFF
        serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x10, 0x15, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // HNR-INS OFF
    }
    
    // UBX-CFG-MSG (NMEA Standard Messages)  msg   msg   Ports 1-6 (every 10th message over UART1, every message over USB)
    //                                                       CLASS   ID   I2C  UART1 UART2  USB   SPI   RESERVED
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GGA - Global positioning system fix data
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GLL - Latitude and longitude, with time of position fix and status
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GSA - GNSS DOP and Active Satellites
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GSV - GNSS Satellites in View
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // RMC - Recommended Minimum data
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // VTG - Course over ground and Ground speed
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GRS - GNSS Range Residuals
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GST - GNSS Pseudo Range Error Statistics
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // ZDA - Time and Date<
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GBS - GNSS Satellite Fault Detection
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // DTM - Datum Reference
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x0D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GNS - GNSS fix data
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x0F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // VLW - Dual ground/water distance

    // //if (settings.processUbx) {
    //     // UBX-CFG-MSG (TURN ON NMEA PUBX Messages)      msg   msg   Ports 1-6
    //     //                                                       Class    ID  I2C  UART1 UART2  USB   SPI   Reseved
    //     //---------------------------------------------------------------------------------------------------------------------
    //     serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00]))); // UBX00
    //     serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x03, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00]))); // UBX03
    //     serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x04, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00]))); // UBX04
    // }
    // else {
        // UBX-CFG-MSG (TURN OFF NMEA PUBX Messages)      msg   msg   Ports 1-6
        //                                                       Class    ID  I2C  UART1 UART2  USB   SPI   Reseved
        //---------------------------------------------------------------------------------------------------------------------
        serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));
        serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));
        serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));
    // }
    
    if (navRate === 10) {
        serialPortWrite(makeUBXCFG(0x06, 0x08, 6, new Uint8Array([0x64, 0x00, 0x01, 0x00, 0x01, 0x00]))); // 100ms & 1 cycle -> 10Hz (UBX-CFG-RATE payload bytes: little endian!)
    } else if (navRate === 5) {
        serialPortWrite(makeUBXCFG(0x06, 0x08, 6, new Uint8Array([0xC8, 0x00, 0x01, 0x00, 0x01, 0x00]))); // 200ms & 1 cycle -> 5Hz (UBX-CFG-RATE payload bytes: little endian!)
    } else if (navRate === 2) {
        serialPortWrite(makeUBXCFG(0x06, 0x08, 6, new Uint8Array([0xF4, 0x01, 0x01, 0x00, 0x01, 0x00]))); // 500ms & 1 cycle -> 2Hz (UBX-CFG-RATE payload bytes: little endian!)
    } else if (navRate === 1) {
        serialPortWrite(makeUBXCFG(0x06, 0x08, 6, new Uint8Array([0xE8, 0x03, 0x01, 0x00, 0x01, 0x00]))); // 1000ms & 1 cycle -> 1Hz (UBX-CFG-RATE payload bytes: little endian!)
    }
}

const writeUblox7ConfigCommands = function() {
    var cfgGnss = new Uint8Array([0x00, 0x00, 0xFF, 0x04]); // numTrkChUse=0xFF: number of tracking channels to use will be set to number of tracking channels available in hardware
    var gps     = new Uint8Array([0x00, 0x04, 0xFF, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable GPS with 4-255 channels (ublox default)
    var sbas    = new Uint8Array([0x01, 0x01, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable SBAS with 1-3 channels (ublox default)
    var qzss    = new Uint8Array([0x05, 0x00, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable QZSS with 0-3 channel (ublox default)
    var glonass = new Uint8Array([0x06, 0x08, 0xFF, 0x00, 0x00, 0x00, 0x01, 0x01]); // disable GLONASS (ublox default)
    cfgGnss = concatTypedArrays(cfgGnss, gps);
    cfgGnss = concatTypedArrays(cfgGnss, sbas);
    cfgGnss = concatTypedArrays(cfgGnss, qzss);
    cfgGnss = concatTypedArrays(cfgGnss, glonass);
    serialPortWrite(makeUBXCFG(0x06, 0x3E, cfgGnss.Length, cfgGnss));
}

const writeUblox8ConfigCommands = function() {
    var cfgGnss = new Uint8Array([0x00, 0x00, 0xFF, 0x05]); // numTrkChUse=0xFF: number of tracking channels to use will be set to number of tracking channels available in hardware
    var gps     = new Uint8Array([0x00, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable GPS with 8-16 channels (ublox default)
    var sbas    = new Uint8Array([0x01, 0x01, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable SBAS with 1-3 channels (ublox default)
    var galileo = new Uint8Array([0x02, 0x08, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable Galileo with 8-8 channels (ublox default: disabled and 4-8 channels)
    var beidou  = new Uint8Array([0x03, 0x08, 0x10, 0x00, 0x00, 0x00, 0x01, 0x01]); // disable BEIDOU
    var qzss    = new Uint8Array([0x05, 0x01, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable QZSS 1-3 channels, L1C/A (ublox default: 0-3 channels)
    var glonass = new Uint8Array([0x06, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable GLONASS with 8-16 channels (ublox default: 8-14 channels)
    
    cfgGnss = concatTypedArrays(cfgGnss, gps);
    cfgGnss = concatTypedArrays(cfgGnss, sbas);
    cfgGnss = concatTypedArrays(cfgGnss, beidou);
    cfgGnss = concatTypedArrays(cfgGnss, qzss);
    cfgGnss = concatTypedArrays(cfgGnss, glonass);
    serialPortWrite(makeUBXCFG(0x06, 0x3E, cfgGnss.Length, cfgGnss)); // Succeeds on all chips supporting GPS+GLO

    cfgGnss[3] = 0x06;
    cfgGnss = concatTypedArrays(cfgGnss, galileo);
    serialPortWrite(makeUBXCFG(0x06, 0x3E, cfgGnss.Length, cfgGnss)); // Succeeds only on chips that support GPS+GLO+GAL
}

const writeUblox9ConfigCommands = function() {
    var cfgGnss = new Uint8Array([0x00, 0x00, 0xFF, 0x06]); // numTrkChUse=0xFF: number of tracking channels to use will be set to number of tracking channels available in hardware
    var gps     = new Uint8Array([0x00, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable GPS with 8-16 channels (ublox default)
    var sbas    = new Uint8Array([0x01, 0x03, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable SBAS with 3-3 channels (ublox default)
    var galileo = new Uint8Array([0x02, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable Galileo with 8-16 channels (ublox default: 8-12 channels)
    var beidou  = new Uint8Array([0x03, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable BEIDOU with 8-16 channels (ublox default: 2-5 channels)
    var qzss    = new Uint8Array([0x05, 0x03, 0x04, 0x00, 0x01, 0x00, 0x05, 0x01]); // enable QZSS 3-4 channels, L1C/A & L1S (ublox default)
    var glonass = new Uint8Array([0x06, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable GLONASS with 8-16 tracking channels (ublox default: 8-12 channels)
    
    cfgGnss = concatTypedArrays(cfgGnss, gps);
    cfgGnss = concatTypedArrays(cfgGnss, sbas);
    cfgGnss = concatTypedArrays(cfgGnss, beidou);
    cfgGnss = concatTypedArrays(cfgGnss, qzss);
    cfgGnss = concatTypedArrays(cfgGnss, glonass);
    cfgGnss = concatTypedArrays(cfgGnss, galileo);
    serialPortWrite(makeUBXCFG(0x06, 0x3E, cfgGnss.Length, cfgGnss));
}

const reconfigureSerialPort = function() {
    // // // Reconfigure serial port.
    // var cfg = new Uint8Array(20);
    // cfg[0] = 0x01; // portID.
    // cfg[1] = 0x00; // res0.
    // cfg[2] = 0x00; // res1.
    // cfg[3] = 0x00; // res1.

        
    // // // [   7   ] [   6   ] [   5   ] [   4   ]
    // // // 0000 0000 0000 0000 0000 1000 1100 0000
    // // // UART mode. 0 stop bits, no parity, 8 data bits. Little endian order.
    // cfg[4] = 0xC0;
    // cfg[5] = 0x08;
    // cfg[6] = 0x00;
    // cfg[7] = 0x00;

    // // // Baud rate. Little endian order.
    // var bdrt = baudRate;
    // cfg[11] = (byte)((bdrt >> 24) & 0xFF);   // = 0x00
    // cfg[10] = (byte)((bdrt >> 16) & 0xFF);   // = 0x01
    // cfg[9] = (byte)((bdrt >> 8) & 0xFF);     // = 0xC2
    // cfg[8] = (byte)(bdrt & 0xFF);            // = 0x00

    // // // inProtoMask. NMEA and UBX. Little endian.
    // cfg[12] = 0x03;
    // cfg[13] = 0x00;

    // // // outProtoMask. NMEA. Little endian.
    // cfg[14] = 0x02;
    // cfg[15] = 0x00;
}

const concatTypedArrays = function(a, b) {
    var newarray = new Uint8Array(a.length + b.length);
    newarray.set(a, 0); // //.concat(a); //(a, 0, newarray, 0, a.length);
    newarray.set(b, a.length); //, 0, newarray, a.length, b.length);
    return newarray;
}

/*
    makeUBXCFG()
        creates a UBX-formatted package consisting of two sync characters,
        class, ID, payload length in bytes (2-byte little endian), payload, and checksum.
        See p. 95 of the u-blox M8 Receiver Description.
*/
const makeUBXCFG = function(cls, id, msglen, msg) {
    var retA = new Uint8Array(6);
    var mlen = msglen;
    retA[0] = 0xB5;
    retA[1] = 0x62;
    retA[2] = cls;
    retA[3] = id;
    retA[4] = (mlen & 0xFF);
    retA[5] = ((mlen >> 8) & 0xFF);
    var retC = concatTypedArrays(retA, msg);
    var chk = chksumUBX(retC, 2);
    return concatTypedArrays(retC, chk);
}

const chksumUBX = function(msg, startIndex) {
    var a = 0,  b = 0;
    var chk = new Uint8Array(2); 
    for (var i = startIndex; i < msg.length; i++) {
        a += msg[i];
        b += a;
    }
    chk[0] = (a & 0xFF);
    chk[1] = (b & 0xFF);
    //var s1 = `${chk[0]}`;
    //var s2 = `${chk[1]}`;
    //Console.WriteLine(s1 + " " + s2);
    return chk;
}

const serialPortWrite = function(msg) {
    serialPort.write(msg);
}

exports.setMessageEnabled = function(cls, id, enabled) {
    var state = enabled ? 0x01 : 0x00;
    serialPortWrite(makeUBXCFG(0x06, 0x01, 8, new Uint8Array([cls, id, 0x00, 0x00, 0x00, state, state, 0x00])));
}