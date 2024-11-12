import { SentenceId } from "../constants";
import parseIntX from "../helpers/parseIntX";
import UbloxMessage from "./UbloxMessage";

export interface UbloxTxtMessageData {
    numberOfSentences: number;
    sentenceNumber: number;
    textId: number;
    textInformation: string;
}

/**
 * # `TXT` - Human readable text information for display purposes
 *
 * ```txt
 *         1  2  3  4   5
 *         |  |  |  |   |
 *  $--TXT,xx,xx,xx,c-c,*hh<CR><LF>
 * ```
 *
 * Field Number:
 *
 * 1. Total number of sentences
 * 2. Sentence number
 * 3. Text Id
 * 4. Message text, up to 61 characters
 * 5. Checksum
 */
export default class UbloxTxtMessage extends UbloxMessage<
    SentenceId.TXT,
    UbloxTxtMessageData
> {
    static readonly sentenceId = SentenceId.TXT;
    static readonly sentenceName =
        "Human readable text information for display purposes";
    static readonly cid = 0xf0;
    static readonly mid = 0x41;

    protected static parse(fields: string[]): UbloxTxtMessageData {
        return {
            numberOfSentences: parseIntX(fields[1]),
            sentenceNumber: parseIntX(fields[2]),
            textId: parseIntX(fields[3]),
            textInformation: fields[4],
        };
    }
}

UbloxMessage.registerClass(UbloxTxtMessage);
