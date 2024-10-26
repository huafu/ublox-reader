const m_hex = "0123456789ABCDEF".split("");

/**
 * Convert a value to a hex string
 * @param {number} v The value to convert to a hex string
 * @returns {string} The hex string representation of the value
 */
export default function toHexString(v) {
    const msn = (v >> 4) & 0x0f;
    const lsn = (v >> 0) & 0x0f;
    return m_hex[msn] + m_hex[lsn];
}
