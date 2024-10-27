/**
 * Encode a time object into a string
 * @param {Date} d Time object
 * @returns {string} Encoded time string
 */
export default function encodeTime(d) {
    if (d === undefined) {
        return "";
    }
    const h = d.getUTCHours();
    const m = d.getUTCMinutes();
    const s = d.getUTCSeconds();
    return (
        h.toString().padStart(2, "0") +
        m.toString().padStart(2, "0") +
        s.toString().padStart(2, "0")
    );
}
