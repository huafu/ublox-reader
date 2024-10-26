import toHexString from "./toHexString.js";

/**
 * Compute the checksum for a NMEA sentence
 * @param {string} sentence The NMEA sentence to compute the checksum for
 * @returns {string} The checksum
 */
export default function computeChecksum(sentence) {
    // skip the $
    let i = 1;

    // init to first character
    let c1 = sentence.charCodeAt(i);

    // process rest of characters, zero delimited
    for (i = 2; i < sentence.length; ++i) {
        c1 = c1 ^ sentence.charCodeAt(i);
    }

    return "*" + toHexString(c1);
}
