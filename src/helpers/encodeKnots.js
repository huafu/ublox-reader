/**
 * Encode knots to a string.
 * @param {number} k Knots
 * @returns {string} Encoded knots
 */
export default function encodeKnots(k) {
    if (k === undefined) {
        return "";
    }
    return k.toFixed(1).padStart(5, "0");
}
