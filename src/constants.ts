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
    // special for plugin messages
    plugin = "$$$",
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

export enum FixType {
    none = "none",
    gps = "gps",
    delta = "delta",
    pps = "pps",
    realTimeKinematic = "rtk",
    floatRtk = "floatRtk",
    estimated = "estimated",
    manual = "manual",
    simulation = "simulation",
}

export enum FixType3D {
    unknown = "unknown",
    none = "none",
    twoD = "2D",
    threeD = "3D",
}
