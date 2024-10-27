/**
 * Parse integer from string
 * @param i String to parse
 * @returns Integer value
 */
export default function parseIntX(i: string): number {
    if (i === "") {
        return 0;
    }
    return parseInt(i, 10);
}
