/**
 * Parse the degrees value and apply the correct sign
 * @param deg The degrees value
 * @param quadrant The quadrant (E/W)
 * @returns The degrees value with the correct sign
 */
export default function parseDegrees(deg: string, quadrant: string): number {
    const q = quadrant === "E" ? -1.0 : 1.0;

    return parseFloat(deg) * q;
}
