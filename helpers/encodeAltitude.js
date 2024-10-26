/**
 * Encode altitude in meters
 * @param {number} alt Altitude in meters
 * @return {string} Encoded altitude
 */
export default function encodeAltitude(alt) {
    if (alt === undefined) {
        return ",";
    }
    return alt.toFixed(1) + ",M";
}
