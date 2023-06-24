"use strict";

class Configurator {
	
	constructor() {
		this.serialPort = "";
		this.baudRate = 9600; 
		this.processUbx = false; 
		this.navRate = 2; 
		this.pid = ""; 
	 	this.settings = {}; 
	}
	
	writeConfig = function(port, pid, settings) {
		this.serialPort = port;
		this.baudRate = settings.baudrate;
		this.processUbx = settings.pubxmessages;
		this.navRate = settings.navrate;
		this.pid = pid;
		this.settings = settings;

		switch (this.pid) {
			case "u-blox6":
			case "u-blox7":
				this.writeUblox7ConfigCommands();
				break;
			case "u-blox8":
				this.writeUblox8ConfigCommands();
				break;
			case "u-blox9":
				this.writeUblox9ConfigCommands();
				break;
			default:
				throw(new Exception("Invalid UBLOX pid. Cannot continue."));
		}
		
		this.writeUbloxGenericConfigCommands();
	}
	
	writeUbloxGenericConfigCommands = function() {
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
		
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x31, 32, tp5));

		// UBX-CFG-NMEA (change NMEA protocol version to 4.0 extended)
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x17, 20, new Uint8Array([0x00, 0x40, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 
																             0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));

		// UBX-CFG-PMS
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x86, 8, new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));   // Full Power Mode
		// serialPortWrite(makeUBXCFG(0x06, 0x86, 8, new Uint8Array([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00})) // Balanced Power Mode

		// UBX-CFG-NAV5 
		// Dynamic platform model: airborne with <2g acceleration
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x24, 36, new Uint8Array([0x01, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
																             0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
																             0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); 

		// UBX-CFG-SBAS (disable integrity, enable auto-scan)
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x16, 8, new Uint8Array([0x01, 0x03, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00])));

		// UBX-CFG-HNR set to 30hz
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x5C, 4, new Uint8Array([0x1E, 0x00, 0x00, 0x00])));
		
		if (this.settings.hnrmessages) {
			//UBX-CFG-MSG setup UBX-HNR-PVT, UBX-HNR-ATT, ESF-INS messages
			//                                                                 CLASS  ID   I2C  UART1 UART2  USB   SPI   RESERVED
			//                                                                 -------------------------------------------------- 
			this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x28, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]))); // HNR-PVT
			this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x28, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]))); // HNR-ATT
			this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x10, 0x15, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]))); // ESF-INS
		}
		else {
			this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x28, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // HNR-PVT
			this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x28, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // HNR-ATT
			this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0x10, 0x15, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // ESF-INS
		}
		// UBX-CFG-MSG (NMEA Standard Messages)  msg   msg   Ports 1-6 (every 10th message over UART1, every message over USB)
		//                                                                 CLASS   ID   I2C  UART1 UART2  USB   SPI   RESERVED
		//-----------------------------------------------------------------------------------------------------------------------------------------------------
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]))); // GGA - Global positioning system fix data
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GLL - Latitude and longitude, with time of position fix and status
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x02, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00]))); // GSA - GNSS DOP and Active Satellites
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x03, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00]))); // GSV - GNSS Satellites in View
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x04, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]))); // RMC - Recommended Minimum data
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x05, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]))); // VGT - Course over ground and Ground speed
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GRS - GNSS Range Residuals
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GST - GNSS Pseudo Range Error Statistics
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // ZDA - Time and Date<
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GBS - GNSS Satellite Fault Detection
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // DTM - Datum Reference
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x0D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // GNS - GNSS fix data
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF0, 0x0F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))); // VLW - Dual ground/water distance

		if (this.processUbx) {
		    // UBX-CFG-MSG (TURN ON NMEA PUBX Messages)      msg   msg   Ports 1-6
		    //                                                                Class     ID  I2C  UART1 UART2  USB   SPI   Reseved
		    //---------------------------------------------------------------------------------------------------------------------
		    this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00]))); // UBX00
		    this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x03, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00]))); // UBX03
		    this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x04, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00]))); // UBX04
		}
		else {
		    // UBX-CFG-MSG (TURN OFF NMEA PUBX Messages)      msg   msg   Ports 1-6
		    //                                                                 Class    ID  I2C  UART1 UART2  USB   SPI   Reseved
		    //---------------------------------------------------------------------------------------------------------------------
		    this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));
		    this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));
		    this.serialPortWrite(this.makeUBXCFG(0x06, 0x01, 8, new Uint8Array([0xF1, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));
		}
		
		if (this.navRate === 10) {
			this.serialPortWrite(this.makeUBXCFG(0x06, 0x08, 6, new Uint8Array([0x64, 0x00, 0x01, 0x00, 0x01, 0x00]))); // 100ms & 1 cycle -> 10Hz (UBX-CFG-RATE payload bytes: little endian!)
		} else if (this.navRate === 5) {
			this.serialPortWrite(this.makeUBXCFG(0x06, 0x08, 6, new Uint8Array([0xC8, 0x00, 0x01, 0x00, 0x01, 0x00]))); // 200ms & 1 cycle -> 5Hz (UBX-CFG-RATE payload bytes: little endian!)
		} else if (this.navRate === 2) {
			this.serialPortWrite(this.makeUBXCFG(0x06, 0x08, 6, new Uint8Array([0xF4, 0x01, 0x01, 0x00, 0x01, 0x00]))); // 500ms & 1 cycle -> 2Hz (UBX-CFG-RATE payload bytes: little endian!)
		} else if (this.navRate === 1) {
			this.serialPortWrite(this.makeUBXCFG(0x06, 0x08, 6, new Uint8Array([0xE8, 0x03, 0x01, 0x00, 0x01, 0x00]))); // 1000ms & 1 cycle -> 1Hz (UBX-CFG-RATE payload bytes: little endian!)
		}
	}

	writeUblox7ConfigCommands = function() {
	    var cfgGnss = new Uint8Array([0x00, 0x00, 0xFF, 0x04]); // numTrkChUse=0xFF: number of tracking channels to use will be set to number of tracking channels available in hardware
		var gps = new Uint8Array([0x00, 0x04, 0xFF, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable GPS with 4-255 channels (ublox default)
		var sbas = new Uint8Array([0x01, 0x01, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable SBAS with 1-3 channels (ublox default)
		var qzss = new Uint8Array([0x05, 0x00, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable QZSS with 0-3 channel (ublox default)
		var glonass = new Uint8Array([0x06, 0x08, 0xFF, 0x00, 0x00, 0x00, 0x01, 0x01]); // disable GLONASS (ublox default)
		cfgGnss = this.concatTypedArrays(cfgGnss, gps);
		cfgGnss = this.concatTypedArrays(cfgGnss, sbas);
		cfgGnss = this.concatTypedArrays(cfgGnss, qzss);
		cfgGnss = this.concatTypedArrays(cfgGnss, glonass);
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x3E, cfgGnss.Length, cfgGnss));
	}

	writeUblox8ConfigCommands = function() {
		var cfgGnss = new Uint8Array([0x00, 0x00, 0xFF, 0x05]); // numTrkChUse=0xFF: number of tracking channels to use will be set to number of tracking channels available in hardware
		var gps     = new Uint8Array([0x00, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable GPS with 8-16 channels (ublox default)
		var sbas    = new Uint8Array([0x01, 0x01, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable SBAS with 1-3 channels (ublox default)
		var galileo = new Uint8Array([0x02, 0x08, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable Galileo with 8-8 channels (ublox default: disabled and 4-8 channels)
		var beidou  = new Uint8Array([0x03, 0x08, 0x10, 0x00, 0x00, 0x00, 0x01, 0x01]); // disable BEIDOU
		var qzss    = new Uint8Array([0x05, 0x01, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable QZSS 1-3 channels, L1C/A (ublox default: 0-3 channels)
		var glonass = new Uint8Array([0x06, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable GLONASS with 8-16 channels (ublox default: 8-14 channels)
		
		cfgGnss = this.concatTypedArrays(cfgGnss, gps);
		cfgGnss = this.concatTypedArrays(cfgGnss, sbas);
		cfgGnss = this.concatTypedArrays(cfgGnss, beidou);
		cfgGnss = this.concatTypedArrays(cfgGnss, qzss);
		cfgGnss = this.concatTypedArrays(cfgGnss, glonass);
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x3E, cfgGnss.Length, cfgGnss)); // Succeeds on all chips supporting GPS+GLO

		cfgGnss[3] = 0x06;
		cfgGnss = this.concatTypedArrays(cfgGnss, galileo);
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x3E, cfgGnss.Length, cfgGnss)); // Succeeds only on chips that support GPS+GLO+GAL
	}

	writeUblox9ConfigCommands = function() {
		var cfgGnss = new Uint8Array([0x00, 0x00, 0xFF, 0x06]); // numTrkChUse=0xFF: number of tracking channels to use will be set to number of tracking channels available in hardware
		var gps     = new Uint8Array([0x00, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable GPS with 8-16 channels (ublox default)
		var sbas    = new Uint8Array([0x01, 0x03, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable SBAS with 3-3 channels (ublox default)
		var galileo = new Uint8Array([0x02, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable Galileo with 8-16 channels (ublox default: 8-12 channels)
		var beidou  = new Uint8Array([0x03, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable BEIDOU with 8-16 channels (ublox default: 2-5 channels)
		var qzss    = new Uint8Array([0x05, 0x03, 0x04, 0x00, 0x01, 0x00, 0x05, 0x01]); // enable QZSS 3-4 channels, L1C/A & L1S (ublox default)
		var glonass = new Uint8Array([0x06, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01]); // enable GLONASS with 8-16 tracking channels (ublox default: 8-12 channels)
		
		cfgGnss = this.concatTypedArrays(cfgGnss, gps);
		cfgGnss = this.concatTypedArrays(cfgGnss, sbas);
		cfgGnss = this.concatTypedArrays(cfgGnss, beidou);
		cfgGnss = this.concatTypedArrays(cfgGnss, qzss);
		cfgGnss = this.concatTypedArrays(cfgGnss, glonass);
		cfgGnss = this.concatTypedArrays(cfgGnss, galileo);
		this.serialPortWrite(this.makeUBXCFG(0x06, 0x3E, cfgGnss.Length, cfgGnss));
	}

	reconfigureSerialPort = function() {
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
		// var bdrt = this.baudRate;
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

	concatTypedArrays = function(a, b) {
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
	makeUBXCFG = function(cls, id, msglen, msg) {
		var retA = new Uint8Array(6);
		var mlen = msglen;
		retA[0] = 0xB5;
		retA[1] = 0x62;
		retA[2] = cls;
		retA[3] = id;
		retA[4] = (mlen & 0xFF);
		retA[5] = ((mlen >> 8) & 0xFF);
		var retC = this.concatTypedArrays(retA, msg);
		var chk = this.chksumUBX(retC, 2);
		return this.concatTypedArrays(retC, chk);
	}

	chksumUBX = function(msg, startIndex) {
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

	 serialPortWrite = function(msg) {
		this.serialPort.write(msg);
	}
}

module.exports = Configurator;