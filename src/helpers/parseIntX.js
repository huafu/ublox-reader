/**
 * Parse integer from string
 * @param {string} i String to parse
 * @returns {number} Integer value
 */
export default function parseIntX(i) {
    if (i === "") {
        return 0;
    }
    return parseInt(i, 10);
}
