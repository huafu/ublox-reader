// fields can be empty so have to wrap the global parseFloat
/**
 * Parse a string to a float
 */
export default function parseFloatX(f: string): number {
    if (f === "") {
        return 0.0;
    }
    return parseFloat(f);
}
