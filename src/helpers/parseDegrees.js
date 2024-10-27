/**
 * Parse the degrees value and apply the correct sign
 * @param {string} deg The degrees value
 * @param {string} quadrant The quadrant (E/W)
 * @returns {number} The degrees value with the correct sign
 */
export default function parseDegrees(deg, quadrant) {
    const q = quadrant === "E" ? -1.0 : 1.0;

    return parseFloat(deg) * q;
}
