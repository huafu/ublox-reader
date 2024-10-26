/**
 * Encode magnetic variation
 * @param {number} v Magnetic variation in degrees
 * @return {string} Encoded magnetic variation
 */
export default function encodeMagVar(v) {
    if (v === undefined) {
        return ",";
    }
    const a = Math.abs(v);
    const s = v < 0 ? a.toFixed(1) + ",E" : a.toFixed(1) + ",W";
    return s.padStart(7, "0");
}
