/**
 * Parse date and time from string to Date object
 * @param {string} date Date in DDMMYY format
 * @param {string} time Time in HHMMSS format
 * @returns {Date} Date object
 */
export default function parseDateTime(date, time) {
    const h = parseInt(time.slice(0, 2), 10);
    const m = parseInt(time.slice(2, 4), 10);
    const s = parseInt(time.slice(4, 6), 10);
    const D = parseInt(date.slice(0, 2), 10);
    const M = parseInt(date.slice(2, 4), 10);
    let Y = parseInt(date.slice(4, 6), 10);
    // hack : GPRMC date doesn't specify century. GPS came out in 1973
    // so if year is less than 73 its 2000, otherwise 1900
    if (Y < 73) {
        Y = Y + 2000;
    } else {
        Y = Y + 1900;
    }
    return new Date(Date.UTC(Y, M - 1, D, h, m, s));
}
