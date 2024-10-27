/**
 * Parse the altitude value and convert it to meters if necessary
 * @param {string} alt The altitude value
 * @param {string} units The units of the altitude value
 * @returns {number} The altitude in meters
 */
export default function parseAltitude(alt, units) {
    let scale = 1.0;
    if (units === "F") {
        scale = 0.3048;
    }
    return parseFloat(alt) * scale;
}
