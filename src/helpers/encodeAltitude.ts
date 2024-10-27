/**
 * Encode altitude in meters
 * @param alt Altitude in meters
 * @return Encoded altitude
 */
export default function encodeAltitude(alt: number | undefined): string {
    if (alt === undefined) {
        return ",";
    }
    return alt.toFixed(1) + ",M";
}
