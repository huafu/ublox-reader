/**
 * Encode a decimal degree value as a string.
 * @param {number} d Decimal degrees
 * @return {string} Encoded decimal degrees
 */
export default function encodeDegrees(d) {
    if (d === undefined) {
        return "";
    }
    return d.toFixed(1).padStart(5, "0");
}
