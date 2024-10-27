/**
 * Encode knots to a string.
 * @param k Knots
 * @returns Encoded knots
 */
export default function encodeKnots(k: number | undefined): string {
    if (k === undefined) {
        return "";
    }
    return k.toFixed(1).padStart(5, "0");
}
