
// fields can be empty so have to wrap the global parseFloat
/**
 * Parse a string to a float
 * @param {string} f
 * @returns {number}
 */
export default function parseFloatX(f) {
    if (f === "") {
        return 0.0;
    }
    return parseFloat(f);
};
