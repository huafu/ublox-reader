/**
 * Encode a decimal degree value as a string.
 * @param d Decimal degrees
 * @return Encoded decimal degrees
 */
export default function encodeDegrees(d: number | undefined): string {
    if (d === undefined) {
        return "";
    }
    return d.toFixed(1).padStart(5, "0");
}
