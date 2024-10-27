/**
 * Calculate the UBX checksum for a given message
 * @param msg The message to calculate the checksum for
 * @param startIndex The index to start calculating the checksum
 * @returns The checksum
 */
export default function ubxChecksum(
    msg: Uint8Array,
    startIndex: number
): Uint8Array {
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
