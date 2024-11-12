import { SentenceId } from "../constants";

const Classes: Array<Class<UbloxMessage>> = [];

export type MessageDataOf<T extends UbloxMessage> = T extends UbloxMessage<
    SentenceId,
    infer D
>
    ? D
    : never;
export type SentenceIdOf<T extends UbloxMessage> = T extends UbloxMessage<
    infer S,
    object
>
    ? S
    : never;

/**
 * Base class for messages
 */
export default abstract class UbloxMessage<
    T extends SentenceId = SentenceId,
    D extends object = object
> {
    get Class() {
        return this.constructor as unknown as Class<UbloxMessage<T>>;
    }

    /**
     * Registers a class
     */
    static registerClass(MessageClass: Class<UbloxMessage>) {
        if (Classes.includes(MessageClass)) return;
        Classes.push(MessageClass);
    }

    /**
     * Get message class by sentence ID
     */
    static ClassForSentenceId<T extends SentenceId>(sentenceId: T) {
        return Classes.find((d) => d.sentenceId === sentenceId) as unknown as
            | Class<UbloxMessage<T>>
            | undefined;
    }

    /**
     * Get all message classes
     */
    static get Classes(): Array<Class<UbloxMessage>> {
        return Classes.slice();
    }

    /**
     * The sentence id of this decoder
     * @abstract
     * @readonly
     */
    static get sentenceId(): SentenceId {
        throw new Error("Not implemented");
    }
    /**
     * The sentence id of this decoder
     * @readonly
     */
    get sentenceId(): T {
        return this.Class.sentenceId as T;
    }
    /**
     * The sentence name of this decoder
     * @abstract
     * @readonly
     */
    static get sentenceName(): string {
        throw new Error("Not implemented");
    }
    /**
     * The sentence name of this decoder
     * @type {string}
     * @readonly
     */
    get sentenceName(): string {
        return this.Class.sentenceName as string;
    }

    /**
     * The class ID of this decoder
     * @abstract
     * @readonly
     */
    static get cid(): number {
        throw new Error("Not implemented");
    }
    /**
     * The class ID of this decoder
     * @readonly
     */
    get cid(): number {
        return this.Class.cid as number;
    }

    /**
     * The message ID of this decoder
     * @abstract
     * @readonly
     */
    static get mid(): number {
        throw new Error("Not implemented");
    }
    /**
     * The message ID of this decoder
     * @readonly
     */
    get mid(): number {
        return this.Class.mid as number;
    }

    private coreData: D;

    constructor(data: D) {
        this.coreData = data;
    }

    /**
     * Parses NMEA fields
     * @param _fields The fields to decode
     * @returns The decoded data
     * @abstract
     */
    protected static parse(_fields: string[]): object {
        throw new Error("Not implemented");
    }

    /**
     * Tries to instantiate a message from NMEA fields
     * @param {string[]} fields The fields to decode
     * @returns {UbloxMessage|undefined} The message or `undefined` if invalid
     */
    static from<T extends SentenceId>(
        fields: string[]
    ): UbloxMessage<T> | undefined {
        if (this.constructor === UbloxMessage) {
            throw new Error("Cannot call from() on the base class");
        }
        if (fields[0] !== (this.sentenceId as string)) return undefined;
        try {
            const data = this.parse(fields);
            const MessageClass = this as unknown as Class<UbloxMessage<T>>;
            return new MessageClass(data);
        } catch (error) {
            console.error(
                `Failed to parse a ${this.sentenceName} message: ${
                    error as string
                }`
            );
        }
    }

    /**
     * Returns JSON object of this decoder
     */
    toJSON(): object {
        return {
            sentenceId: this.sentenceId,
            sentenceName: this.sentenceName,
            cid: this.cid,
            mid: this.mid,
            ...this.data,
        };
    }

    /**
     * Returns the data of this message
     */
    get data(): D {
        return this.coreData;
    }
}
