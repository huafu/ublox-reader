/**
 * Concatenate two typed arrays
 */
export default function concatTypedArrays(
    a: Uint8Array,
    b: Uint8Array
): Uint8Array {
    const res = new Uint8Array(a.length + b.length);
    res.set(a, 0);
    res.set(b, a.length);
    return res;
}
