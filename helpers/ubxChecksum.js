/**
 * Calculate the UBX checksum for a given message
 * @param {Uint8Array} msg The message to calculate the checksum for
 * @param {number} startIndex The index to start calculating the checksum
 * @returns {Uint8Array} The checksum
 */
export default function ubxChecksum(msg, startIndex) {
    let a = 0,
        b = 0;
    const chk = new Uint8Array(2);
    for (let i = startIndex; i < msg.length; i++) {
        a += msg[i];
        b += a;
    }
    chk[0] = a & 0xff;
    chk[1] = b & 0xff;
    return chk;
}
