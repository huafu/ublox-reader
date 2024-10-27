/**
 * Product ID of a device
 */
export enum ProductId {
    Antaris4 = "Antaris4",
    uBlox5 = "u-blox5",
    uBlox6 = "u-blox6",
    uBlox7 = "u-blox7",
    uBlox8 = "u-blox8",
    uBlox9 = "u-blox9",
}

/**
 * NMEA sentence types
 */
export enum SentenceId {
    DTM = "DTM",
    GBS = "GBS",
    GGA = "GGA",
    GLL = "GLL",
    GNS = "GNS",
    GRS = "GRS",
    GSA = "GSA",
    GST = "GST",
    GSV = "GSV",
    RMC = "RMC",
    VLW = "VLW",
    VTG = "VTG",
    ZDA = "ZDA",
    UBX00 = "UBX00",
    UBX03 = "UBX03",
    UBX04 = "UBX04",
    THS = "THS",
    TXT = "TXT",
}

/**
 * Navigation rate options
 */
export enum NavRate {
    one = "1",
    two = "2",
    five = "5",
    ten = "10",
}
