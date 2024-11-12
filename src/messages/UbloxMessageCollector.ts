import UbloxMessage, { MessageDataOf, SentenceIdOf } from "./UbloxMessage";

interface DataHolder<T extends UbloxMessage> {
    time: Date;
    data: MessageDataOf<T>;
}

interface DataHolderEx<T extends UbloxMessage> extends DataHolder<T> {
    elapsed: number;
}

interface MessageInfo<T extends UbloxMessage> {
    count: number;
    last: DataHolder<T>;
    previous?: DataHolder<T>;
}

/**
 * Collects messages
 */
export default class UbloxMessageCollector {
    protected db: Record<string, MessageInfo<UbloxMessage>>;

    constructor() {
        this.db = {};
    }

    /**
     * Completes the holder
     * @param holder The holder
     * @returns The completed holder
     */
    protected completeHolder(holder: void): void;
    protected completeHolder<T extends UbloxMessage>(
        holder: DataHolder<T>
    ): DataHolderEx<T>;
    protected completeHolder<T extends UbloxMessage>(
        holder: DataHolder<T> | void
    ): DataHolderEx<T> | void {
        if (!holder) return;
        return {
            ...holder,
            elapsed: Date.now() - holder.time.getTime(),
        };
    }

    /**
     * Collects a message
     * @param message The message to collect
     * @returns The message info
     */
    collect<T extends UbloxMessage>(message: T): MessageInfo<T> {
        const key = message.sentenceId;
        let info = this.db[key];
        const last = {
            time: new Date(),
            data: message.data,
        };

        if (!info) {
            // not found in the db
            this.db[key] = info = {
                count: 0,
                last,
            };
        } else {
            // found in the db
            info.previous = info.last;
            info.last = last;
        }
        // increment the count
        info.count++;

        return info;
    }

    /**
     * Gets the message info
     * @param sentenceId The sentence ID
     * @returns The message info
     */
    get<T extends UbloxMessage>(
        sentenceId: SentenceIdOf<T>
    ): MessageInfo<T> | void {
        return this.db[sentenceId];
    }

    last<T extends UbloxMessage>(
        sentenceId: SentenceIdOf<T>
    ): DataHolderEx<T> | void {
        return this.completeHolder(this.db[sentenceId]?.last);
    }

    previous<T extends UbloxMessage>(
        sentenceId: SentenceIdOf<T>
    ): DataHolderEx<T> | void {
        return this.completeHolder(
            this.db[sentenceId]?.previous as DataHolder<T>
        );
    }

    count<T extends UbloxMessage>(sentenceId: SentenceIdOf<T>): number {
        return this.db[sentenceId]?.count ?? 0;
    }
}
