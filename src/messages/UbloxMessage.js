/** @type {Array<typeof UbloxMessage>} */
const Classes = [];

/**
 * Base class for messages
 * @abstract
 */
export default class UbloxMessage {
    /**
     * Registers a class
     * @param {typeof UbloxMessage} MessageClass
     */
    static registerClass(MessageClass) {
        if (!(MessageClass.prototype instanceof UbloxMessage))
            throw new Error("Invalid class");
        if (Classes.includes(MessageClass)) return;
        Classes.push(MessageClass);
    }

    /**
     * Get message class by sentence ID
     * @param {import("../helpers/constants").SentenceId} sentenceId
     * @returns {typeof UbloxMessage}
     */
    static ClassForSentenceId(sentenceId) {
        return Classes.find((d) => d.sentenceId === sentenceId);
    }

    /**
     * Get all message classes
     * @returns {Array<typeof UbloxMessage>}
     */
    static get Classes() {
        return Classes.slice();
    }

    /**
     * The sentence id of this decoder
     * @type {import("../helpers/constants").SentenceId}
     * @abstract
     * @readonly
     */
    static get sentenceId() {
        throw new Error("Not implemented");
    }
    /**
     * The sentence id of this decoder
     * @type {import("../helpers/constants").SentenceId}
     * @readonly
     */
    get sentenceId() {
        return this.constructor.sentenceId;
    }
    /**
     * The sentence name of this decoder
     * @type {string}
     * @abstract
     * @readonly
     */
    static get sentenceName() {
        throw new Error("Not implemented");
    }
    /**
     * The sentence name of this decoder
     * @type {string}
     * @readonly
     */
    get sentenceName() {
        return this.constructor.sentenceName;
    }

    /**
     * The class ID of this decoder
     * @type {number}
     * @abstract
     * @readonly
     */
    static get cid() {
        throw new Error("Not implemented");
    }
    /**
     * The class ID of this decoder
     * @type {number}
     * @readonly
     */
    get cid() {
        return this.constructor.cid;
    }

    /**
     * The message ID of this decoder
     * @type {number}
     * @abstract
     * @readonly
     */
    static get mid() {
        throw new Error("Not implemented");
    }
    /**
     * The message ID of this decoder
     * @type {number}
     * @readonly
     */
    get mid() {
        return this.constructor.mid;
    }

    /**
     * @param {Object} data
     * @private
     */
    constructor(data) {
        /**
         * Data of this message
         * @type {Object}
         * @protected
         * @readonly
         */
        this.data = data;
    }

    /**
     * Parses NMEA fields
     * @param {string[]} fields The fields to decode
     * @returns {Object|null} The decoded data
     * @protected
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    static parse(fields) {
        throw new Error("Not implemented");
    }

    /**
     * Tries to instantiate a message from NMEA fields
     * @param {string[]} fields The fields to decode
     * @returns {UbloxMessage|undefined} The message or `undefined` if invalid
     */
    static from(fields) {
        if (this.constructor === UbloxMessage) {
            throw new Error("Cannot call from() on the base class");
        }
        if (fields[0] !== this.sentenceId) return undefined;
        try {
            const data = this.parse(fields);
            return new this(data);
        } catch (error) {
            console.error(
                `Failed to parse a ${this.sentenceName} message: ${error}`
            );
        }
    }

    /**
     * Returns JSON object of this decoder
     * @returns {Object}
     */
    toJSON() {
        return {
            sentenceId: this.sentenceId,
            sentenceName: this.sentenceName,
            cid: this.cid,
            mid: this.mid,
            ...this.data,
        };
    }
}
