import concatTypedArrays from "../helpers/concatTypedArrays.js";
import { NavRate, ProductId } from "../helpers/constants.js";
import makeUbxPkg from "../helpers/makeUbxPkg.js";

const BytesByRate = {
    // 1000ms & 1 cycle -> 1Hz (UBX-CFG-RATE payload bytes: little endian!)
    [NavRate.one]: [0xe8, 0x03, 0x01, 0x00, 0x01, 0x00],
    // 500ms & 1 cycle -> 2Hz (UBX-CFG-RATE payload bytes: little endian!)
    [NavRate.two]: [0xf4, 0x01, 0x01, 0x00, 0x01, 0x00],
    // 200ms & 1 cycle -> 5Hz (UBX-CFG-RATE payload bytes: little endian!)
    [NavRate.five]: [0xc8, 0x00, 0x01, 0x00, 0x01, 0x00],
    // 100ms & 1 cycle -> 10Hz (UBX-CFG-RATE payload bytes: little endian!)
    [NavRate.ten]: [0x64, 0x00, 0x01, 0x00, 0x01, 0x00],
};

/**
 * Class for configuring the serial port.
 */
export default class SerialConfigurator {
    /**
     * Constructor for SerialConfigurator.
     * @param {import("serialport").SerialPort} port The serial port.
     */
    constructor(port) {
        /** @type {import("serialport").SerialPort} */
        this.port = port;
    }

    /**
     * Setup the device
     * @param {ProductId} pid
     * @returns {void}
     */
    setupDevice(pid) {
        // Check if the product ID is valid
        if (
            ![
                ProductId.uBlox6,
                ProductId.uBlox7,
                ProductId.uBlox8,
                ProductId.uBlox9,
            ].includes(pid)
        ) {
            throw new Error(
                "Invalid or unhandled U-BLOX product ID. Cannot continue."
            );
        }

        // Ensure the port is open
        if (!this.port.isOpen) {
            throw new Error("Serial port is not open, cannot setup device.");
        }

        // Write the configuration commands
        switch (pid) {
            case ProductId.uBlox6:
            case ProductId.uBlox7:
                this.setupUblox7();
                break;
            case ProductId.uBlox8:
                this.setupUblox8();
                break;
            case ProductId.uBlox9:
                this.setupUblox9();
                break;
        }
        this.setupUblox();
    }

    /**
     * Write data to the serial port.
     * @param {Uint8Array} data The data to write.
     * @returns {this}
     * @private
     */
    write(data) {
        this.port.write(data);
        return this;
    }

    /**
     * Write a U-BLOX package to the serial port.
     * @param {number} cls Class of message.
     * @param {number} id ID of message.
     * @param {number} msgLen Length of message in bytes.
     * @param {Uint8Array} msg The message.
     * @returns {this}
     * @private
     */
    writePkg(cls, id, msgLen, msg) {
        return this.write(makeUbxPkg(cls, id, msgLen, msg));
    }

    /**
     * Write U-BLOX generic configuration commands.
     * @private
     */
    setupUblox() {
        // Turn off "time pulse" (usually drives an LED).
        const tp5 = new Uint8Array(32);
        tp5[1] = 0x01;
        tp5[4] = 0x32;
        tp5[8] = 0x40;
        tp5[9] = 0x42;
        tp5[10] = 0x0f;
        tp5[12] = 0x40;
        tp5[13] = 0x42;
        tp5[14] = 0x0f;
        tp5[28] = 0xe7;

        this.writePkg(0x06, 0x31, 32, tp5);

        // UBX-CFG-NMEA (change NMEA protocol version to 4.0 extended)
        this.writePkg(
            0x06,
            0x17,
            20,
            new Uint8Array([
                0x00, 0x40, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00,
                0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ])
        );

        // UBX-CFG-PMS
        this.writePkg(
            0x06,
            0x86,
            8,
            new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        ); // Full Power Mode
        // this.writePkg(0x06, 0x86, 8, new Uint8Array([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}) // Balanced Power Mode

        // UBX-CFG-NAV5
        // Dynamic platform model: airborne with <2g acceleration
        this.writePkg(
            0x06,
            0x24,
            36,
            new Uint8Array([
                0x01, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ])
        );

        // UBX-CFG-SBAS (disable integrity, enable auto-scan)
        this.writePkg(
            0x06,
            0x16,
            8,
            new Uint8Array([0x01, 0x03, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00])
        );

        // UBX-CFG-HNR set to 5hz
        this.writePkg(0x06, 0x5c, 4, new Uint8Array([0x05, 0x00, 0x00, 0x00]));

        // //UBX-CFG-MSG setup UBX-HNR-PVT, UBX-HNR-ATT, ESF-INS messages
        // //                              	                                   CLASS  ID   I2C  UART1 UART2  USB   SPI   RESERVED
        // //                            	    	                               --------------------------------------------------
        // if (settings.hnrmessages) {
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0x28, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00])); // HNR-PVT ON
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0x28, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00])); // HNR-ATT ON
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0x10, 0x15, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00])); // HNR-INS ON
        // }
        // else {
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0x28, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // HNR-PVT OFF
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0x28, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // HNR-ATT OFF
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0x10, 0x15, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // HNR-INS OFF
        // }

        // // UBX-CFG-MSG (NMEA Standard Messages)  msg   msg   Ports 1-6 (every 10th message over UART1, every message over USB)
        // //                                                       CLASS   ID   I2C  UART1 UART2  USB   SPI   RESERVED
        // //-----------------------------------------------------------------------------------------------------------------------------------------------------
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // GGA - Global positioning system fix data
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // GLL - Latitude and longitude, with time of position fix and status
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // GSA - GNSS DOP and Active Satellites
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // GSV - GNSS Satellites in View
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // RMC - Recommended Minimum data
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // VTG - Course over ground and Ground speed
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // GRS - GNSS Range Residuals
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // GST - GNSS Pseudo Range Error Statistics
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // ZDA - Time and Date<
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // GBS - GNSS Satellite Fault Detection
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // DTM - Datum Reference
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x0D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // GNS - GNSS fix data
        // this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF0, 0x0F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])); // VLW - Dual ground/water distance

        // //if (settings.processUbx) {
        //     // UBX-CFG-MSG (TURN ON NMEA PUBX Messages)      msg   msg   Ports 1-6
        //     //                                                       Class    ID  I2C  UART1 UART2  USB   SPI   Reseved
        //     //---------------------------------------------------------------------------------------------------------------------
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF1, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00])); // UBX00
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF1, 0x03, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00])); // UBX03
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF1, 0x04, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00])); // UBX04
        // }
        // else {
        //     // UBX-CFG-MSG (TURN OFF NMEA PUBX Messages)      msg   msg   Ports 1-6
        //     //                                                       Class    ID  I2C  UART1 UART2  USB   SPI   Reseved
        //     //---------------------------------------------------------------------------------------------------------------------
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF1, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
        //     this.writePkg(0x06, 0x01, 8, new Uint8Array([0xF1, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
        // // }

        if (this.navRate === 10) {
            this.writePkg(
                0x06,
                0x08,
                6,
                new Uint8Array([0x64, 0x00, 0x01, 0x00, 0x01, 0x00])
            ); // 100ms & 1 cycle -> 10Hz (UBX-CFG-RATE payload bytes: little endian!)
        } else if (this.navRate === 5) {
            this.writePkg(
                0x06,
                0x08,
                6,
                new Uint8Array([0xc8, 0x00, 0x01, 0x00, 0x01, 0x00])
            ); // 200ms & 1 cycle -> 5Hz (UBX-CFG-RATE payload bytes: little endian!)
        } else if (this.navRate === 2) {
            this.writePkg(
                0x06,
                0x08,
                6,
                new Uint8Array([0xf4, 0x01, 0x01, 0x00, 0x01, 0x00])
            ); // 500ms & 1 cycle -> 2Hz (UBX-CFG-RATE payload bytes: little endian!)
        } else if (this.navRate === 1) {
            this.writePkg(
                0x06,
                0x08,
                6,
                new Uint8Array([0xe8, 0x03, 0x01, 0x00, 0x01, 0x00])
            ); // 1000ms & 1 cycle -> 1Hz (UBX-CFG-RATE payload bytes: little endian!)
        }
    }

    /**
     * Write U-BLOX 7 configuration commands.
     * @private
     */
    setupUblox7() {
        let cfgGnss = new Uint8Array([0x00, 0x00, 0xff, 0x04]); // numTrkChUse=0xFF: number of tracking channels to use will be set to number of tracking channels available in hardware
        const gps = new Uint8Array([
            0x00, 0x04, 0xff, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable GPS with 4-255 channels (ublox default)
        const sbas = new Uint8Array([
            0x01, 0x01, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable SBAS with 1-3 channels (ublox default)
        const qzss = new Uint8Array([
            0x05, 0x00, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable QZSS with 0-3 channel (ublox default)
        const glonass = new Uint8Array([
            0x06, 0x08, 0xff, 0x00, 0x00, 0x00, 0x01, 0x01,
        ]); // disable GLONASS (ublox default)
        cfgGnss = concatTypedArrays(cfgGnss, gps);
        cfgGnss = concatTypedArrays(cfgGnss, sbas);
        cfgGnss = concatTypedArrays(cfgGnss, qzss);
        cfgGnss = concatTypedArrays(cfgGnss, glonass);
        this.writePkg(0x06, 0x3e, cfgGnss.Length, cfgGnss);
    }

    /**
     * Write U-BLOX 8 configuration commands.
     * @private
     */
    setupUblox8() {
        let cfgGnss = new Uint8Array([0x00, 0x00, 0xff, 0x05]); // numTrkChUse=0xFF: number of tracking channels to use will be set to number of tracking channels available in hardware
        const gps = new Uint8Array([
            0x00, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable GPS with 8-16 channels (ublox default)
        const sbas = new Uint8Array([
            0x01, 0x01, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable SBAS with 1-3 channels (ublox default)
        const galileo = new Uint8Array([
            0x02, 0x08, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable Galileo with 8-8 channels (ublox default: disabled and 4-8 channels)
        const beidou = new Uint8Array([
            0x03, 0x08, 0x10, 0x00, 0x00, 0x00, 0x01, 0x01,
        ]); // disable BEIDOU
        const qzss = new Uint8Array([
            0x05, 0x01, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable QZSS 1-3 channels, L1C/A (ublox default: 0-3 channels)
        const glonass = new Uint8Array([
            0x06, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable GLONASS with 8-16 channels (ublox default: 8-14 channels)

        cfgGnss = concatTypedArrays(cfgGnss, gps);
        cfgGnss = concatTypedArrays(cfgGnss, sbas);
        cfgGnss = concatTypedArrays(cfgGnss, beidou);
        cfgGnss = concatTypedArrays(cfgGnss, qzss);
        cfgGnss = concatTypedArrays(cfgGnss, glonass);
        this.writePkg(0x06, 0x3e, cfgGnss.Length, cfgGnss); // Succeeds on all chips supporting GPS+GLO

        cfgGnss[3] = 0x06;
        cfgGnss = concatTypedArrays(cfgGnss, galileo);
        this.writePkg(0x06, 0x3e, cfgGnss.Length, cfgGnss); // Succeeds only on chips that support GPS+GLO+GAL
    }

    /**
     * Write U-BLX 9 configuration commands.
     * @private
     */
    setupUblox9() {
        let cfgGnss = new Uint8Array([0x00, 0x00, 0xff, 0x06]); // numTrkChUse=0xFF: number of tracking channels to use will be set to number of tracking channels available in hardware
        const gps = new Uint8Array([
            0x00, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable GPS with 8-16 channels (ublox default)
        const sbas = new Uint8Array([
            0x01, 0x03, 0x03, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable SBAS with 3-3 channels (ublox default)
        const galileo = new Uint8Array([
            0x02, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable Galileo with 8-16 channels (ublox default: 8-12 channels)
        const beidou = new Uint8Array([
            0x03, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable BEIDOU with 8-16 channels (ublox default: 2-5 channels)
        const qzss = new Uint8Array([
            0x05, 0x03, 0x04, 0x00, 0x01, 0x00, 0x05, 0x01,
        ]); // enable QZSS 3-4 channels, L1C/A & L1S (ublox default)
        const glonass = new Uint8Array([
            0x06, 0x08, 0x10, 0x00, 0x01, 0x00, 0x01, 0x01,
        ]); // enable GLONASS with 8-16 tracking channels (ublox default: 8-12 channels)

        cfgGnss = concatTypedArrays(cfgGnss, gps);
        cfgGnss = concatTypedArrays(cfgGnss, sbas);
        cfgGnss = concatTypedArrays(cfgGnss, beidou);
        cfgGnss = concatTypedArrays(cfgGnss, qzss);
        cfgGnss = concatTypedArrays(cfgGnss, glonass);
        cfgGnss = concatTypedArrays(cfgGnss, galileo);
        this.writePkg(0x06, 0x3e, cfgGnss.Length, cfgGnss);
    }

    /**
     * Enable or disable a message type
     * @param {typeof import("./UbloxMessage").default} MessageClass Message class to enable/disable.
     * @param {boolean} [enabled] True to enable, false to disable.
     * @returns {this} The SerialConfigurator object.
     */
    enableMessages(MessageClass, enabled = true) {
        const state = enabled ? 0x01 : 0x00;
        this.writePkg(
            0x06,
            0x01,
            8,
            new Uint8Array([
                MessageClass.cid,
                MessageClass.mid,
                0x00,
                0x00,
                0x00,
                state,
                state,
                0x00,
            ])
        );
        return this;
    }

    /**
     * Set the navigation rate.
     * @param {NavRate} rate The navigation rate.
     * @returns {this} The SerialConfigurator object.
     */
    setNavRate(rate) {
        const bytes = BytesByRate[rate];
        if (!bytes) {
            throw new Error(`Invalid NavRate: ${rate}`);
        }
        return this.writePkg(0x06, 0x08, 6, new Uint8Array(bytes));
    }
}
