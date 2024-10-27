/**
 * Parse time from string to Date object
 * @param {string} time Time in HHMMSS format
 * @returns {Date} Date object
 */
export default function parseTime(time) {
    const h = parseInt(time.slice(0, 2), 10);
    const m = parseInt(time.slice(2, 4), 10);
    const s = parseInt(time.slice(4, 6), 10);
    const now = new Date();
    const D = now.getDate();
    const M = now.getMonth();
    const Y = now.getFullYear();
    return new Date(Date.UTC(Y, M, D, h, m, s));
}
