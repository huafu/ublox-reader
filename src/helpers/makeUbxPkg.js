import concatTypedArrays from "./concatTypedArrays.js";
import ubxChecksum from "./ubxChecksum.js";

/**
 * Creates a UBX-formatted package consisting of two sync characters,
 * class, ID, payload length in bytes (2-byte little endian), payload, and checksum.
 * See p. 95 of the u-blox M8 Receiver Description.
 * @param {number} cls Class of message.
 * @param {number} id ID of message.
 * @param {number} msgLen Length of message in bytes.
 * @param {Uint8Array} msg The message.
 * @returns {Uint8Array} The UBX-formatted package.
 */
export default function makeUbxPkg(cls, id, msgLen, msg) {
    const retA = new Uint8Array(6);
    const len = msgLen;
    retA[0] = 0xb5;
    retA[1] = 0x62;
    retA[2] = cls;
    retA[3] = id;
    retA[4] = len & 0xff;
    retA[5] = (len >> 8) & 0xff;
    const retC = concatTypedArrays(retA, msg);
    const chk = ubxChecksum(retC, 2);
    return concatTypedArrays(retC, chk);
}
