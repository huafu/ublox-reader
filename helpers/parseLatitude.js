/**
 * Decode latitude
 * @param {string} lat Latitude in NMEA format
 * @param {string} hemi Hemisphere
 * @returns {number} Latitude in decimal degrees
 */
export default function parseLatitude(lat, hemi) {
    let h = hemi === "N" ? 1.0 : -1.0;
    if (lat[0] === "-") {
        //Swap hemis
        h *= -1;
        lat = lat.substring(1);
    }
    const a = lat.split(".");

    let dg, mn;
    if (a[0].length === 4) {
        // two digits of degrees
        dg = lat.substring(0, 2);
        mn = lat.substring(2);
    } else if (a[0].length === 3) {
        // 1 digit of degrees (in case no leading zero)
        dg = lat.substring(0, 1);
        mn = lat.substring(1);
    } else {
        // no degrees, just minutes (nonstandard but a buggy unit might do this)
        dg = "0";
        mn = lat;
    }
    // latitude is usually precise to 5-8 digits
    return ((parseFloat(dg) + parseFloat(mn) / 60.0) * h).toFixed(8);
}
