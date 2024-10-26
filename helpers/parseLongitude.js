/**
 * Decode longitude
 * @param {string} lon Longitude in NMEA format
 * @param {string} hemi Hemisphere
 * @returns {number} Longitude in decimal degrees
 */
export default function parseLongitude(lon, hemi) {
    let h = hemi === "E" ? 1.0 : -1.0;
    if (lon[0] === "-") {
        h *= -1; //swap hemis
        lon = lon.substring(1);
    }

    const a = lon.split(".");

    let dg, mn;
    if (a[0].length === 5) {
        // three digits of degrees
        dg = lon.substring(0, 3);
        mn = lon.substring(3);
    } else if (a[0].length === 4) {
        // 2 digits of degrees (in case no leading zero)
        dg = lon.substring(0, 2);
        mn = lon.substring(2);
    } else if (a[0].length === 3) {
        // 1 digit of degrees (in case no leading zero)
        dg = lon.substring(0, 1);
        mn = lon.substring(1);
    } else {
        // no degrees, just minutes (nonstandard but a buggy unit might do this)
        dg = "0";
        mn = lon;
    }
    // longitude is usually precise to 5-8 digits
    return ((parseFloat(dg) + parseFloat(mn) / 60.0) * h).toFixed(8);
}
