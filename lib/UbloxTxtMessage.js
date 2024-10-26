import { SentenceId } from "../helpers/constants.js";
import parseIntX from "../helpers/parseIntX.js";
import UbloxMessage from "./UbloxMessage.js";

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
export default class UbloxTxtMessage extends UbloxMessage {
    static sentenceId = SentenceId.TXT;
    static sentenceName =
        "Human readable text information for display purposes";
    static cid = 0xf0;
    static mid = 0x41;
    static parse(fields) {
        return {
            numberOfSentences: parseIntX(fields[1]),
            sentenceNumber: parseIntX(fields[2]),
            textId: parseIntX(fields[3]),
            textInformation: fields[4],
        };
    }
}

UbloxMessage.registerClass(UbloxTxtMessage);
