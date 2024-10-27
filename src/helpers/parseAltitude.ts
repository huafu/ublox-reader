/**
 * Parse the altitude value and convert it to meters if necessary
 * @param alt The altitude value
 * @param units The units of the altitude value
 * @returns The altitude in meters
 */
export default function parseAltitude(alt: string, units: string): number {
    let scale = 1.0;
    if (units === "F") {
        scale = 0.3048;
    }
    return parseFloat(alt) * scale;
}
