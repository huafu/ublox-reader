/**
 * Encode longitude in NMEA format
 * @param {number} lon Longitude in decimal degrees
 * @returns {string} Longitude in NMEA format
 */
export default function encodeLongitude(lon) {
    if (lon === undefined) {
        return "";
    }

    let h;
    if (lon < 0) {
        h = "W";
        lon = -lon;
    } else {
        h = "E";
    }

    // get integer degrees
    const d = Math.floor(lon);
    // degrees are always 3 digits
    let s = d.toString();
    while (s.length < 3) {
        s = "0" + s;
    }

    // get fractional degrees
    const f = lon - d;
    // convert to fractional minutes and round up to the specified precision
    const m = f * 60.0;
    // minutes are always 6 characters = mm.mmm
    let t = m.toFixed(3);
    if (m < 10) {
        // add leading 0
        t = "0" + t;
    }
    s = s + t + "," + h;
    return s;
}
