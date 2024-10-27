/**
 * Encode latitude
 * @param {number} lat Latitude in decimal degrees
 * @returns {string} Latitude in NMEA format
 */
export default function encodeLatitude(lat) {
    if (lat === undefined) {
        return "";
    }

    let h;
    if (lat < 0) {
        h = "S";
        lat = -lat;
    } else {
        h = "N";
    }
    // get integer degrees
    const d = Math.floor(lat);
    // degrees are always 2 digits
    let s = d.toString();
    if (s.length < 2) {
        s = "0" + s;
    }
    // get fractional degrees
    const f = lat - d;
    // convert to fractional minutes
    const m = f * 60.0;
    // format the fixed point fractional minutes
    let t = m.toFixed(3);
    if (m < 10) {
        // add leading 0
        t = "0" + t;
    }

    s = s + t + "," + h;
    return s;
}
