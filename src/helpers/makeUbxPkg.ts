import concatTypedArrays from "./concatTypedArrays";
import ubxChecksum from "./ubxChecksum";

/**
 * Creates a UBX-formatted package consisting of two sync characters,
 * class, ID, payload length in bytes (2-byte little endian), payload, and checksum.
 * See p. 95 of the u-blox M8 Receiver Description.
 * @param cls Class of message.
 * @param id ID of message.
 * @param msgLen Length of message in bytes.
 * @param msg The message.
 * @returns The UBX-formatted package.
 */
export default function makeUbxPkg(
    cls: number,
    id: number,
    msgLen: number,
    msg: Uint8Array
): Uint8Array {
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
