/**
 * Encode magnetic variation
 * @param v Magnetic variation in degrees
 * @return Encoded magnetic variation
 */
export default function encodeMagVar(v: number | undefined): string {
    if (v === undefined) {
        return ",";
    }
    const a = Math.abs(v);
    const s = v < 0 ? a.toFixed(1) + ",E" : a.toFixed(1) + ",W";
    return s.padStart(7, "0");
}
