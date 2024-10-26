/**
 * Product ID of a device
 * @readonly
 * @enum {string}
 */
export const ProductId = {
    Antaris4: "Antaris4",
    uBlox5: "u-blox5",
    uBlox6: "u-blox6",
    uBlox7: "u-blox7",
    uBlox8: "u-blox8",
    uBlox9: "u-blox9",
};

/**
 * @typedef {Object} DeviceInfo
 * @property {string} path
 * @property {ProductId} pid
 */

/**
 * NMEA sentence types
 * @readonly
 * @enum {string}
 */
export const SentenceId = {
    DTM: "DTM",
    GBS: "GBS",
    GGA: "GGA",
    GLL: "GLL",
    GNS: "GNS",
    GRS: "GRS",
    GSA: "GSA",
    GST: "GST",
    GSV: "GSV",
    RMC: "RMC",
    VLW: "VLW",
    VTG: "VTG",
    ZDA: "ZDA",
    UBX00: "UBX00",
    UBX03: "UBX03",
    UBX04: "UBX04",
    TXT: "TXT",
};

/**
 * Navigation rate options
 * @readonly
 * @enum {string}
 */
export const NavRate = {
    one: "1",
    two: "2",
    five: "5",
    ten: "10",
};
