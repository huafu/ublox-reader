/**
 * Verify the checksum of a NMEA sentence
 * @param {string} sentence NMEA sentence
 * @param {string} checksum Checksum to verify
 * @returns {boolean} Whether checksum is valid
 */
export default function verifyChecksum(sentence, checksum) {
    // skip the $
    let i = 1;

    // init to first character
    let c1 = sentence.charCodeAt(i);

    // process rest of characters, zero delimited
    for (i = 2; i < sentence.length; ++i) {
        c1 = c1 ^ sentence.charCodeAt(i);
    }

    // checksum is a 2 digit hex value
    const c2 = parseInt(checksum, 16);

    // should be equal
    return (c1 & 0xff) === c2;
}
