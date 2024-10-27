/**
 * Encode a date object into a string in the format DDMMYY
 * @param {Date} d Date object
 * @return {string} Encoded date
 */
export default function encodeDate(d) {
    if (d === undefined) {
        return "";
    }
    const yr = d.getUTCFullYear();
    const mn = d.getUTCMonth() + 1;
    const dy = d.getUTCDate();
    return (
        dy.toString().padStart(2, "0") +
        mn.toString().padStart(2, "0") +
        yr.toString().substring(2)
    );
}
