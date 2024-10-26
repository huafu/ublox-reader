import UbloxMessage from "../lib/UbloxMessage.js";
import "../lib/UbloxDtmMessage.js";
import "../lib/UbloxGbsMessage.js";
import "../lib/UbloxGgaMessage.js";
import "../lib/UbloxGllMessage.js";
import "../lib/UbloxGnsMessage.js";
import "../lib/UbloxGrsMessage.js";
import "../lib/UbloxGsaMessage.js";
import "../lib/UbloxGstMessage.js";
import "../lib/UbloxGsvMessage.js";
import "../lib/UbloxRmcMessage.js";
import "../lib/UbloxThsMessage.js";
import "../lib/UbloxTxtMessage.js";
import "../lib/UbloxUbx00Message.js";
import "../lib/UbloxUbx03Message.js";
import "../lib/UbloxUbx04Message.js";
import "../lib/UbloxVlwMessage.js";
import "../lib/UbloxVtgMessage.js";
import "../lib/UbloxZdaMessage.js";

/**
 * Parse a sentence into a message object
 * @param {string} sentence
 * @returns {UbloxMessage|undefined}
 */
export default function sentenceToMessage(sentence) {
    /** @type {string[]} */
    let fields;
    /** @type {import("./constants").SentenceId} */
    let sentenceId;

    if (!sentence.startsWith("$")) return undefined;

    if (sentence.startsWith("$PUB")) {
        fields = sentence.substring(2, sentence.length - 2).split(",");
    } else {
        fields = sentence.substring(3, sentence.length - 3).split(",");
    }
    sentenceId = fields[0];
    if (sentenceId === "UBX") {
        sentenceId += fields[1];
    }
    const MessageClass = UbloxMessage.ClassForSentenceId(sentenceId);
    if (!MessageClass) return undefined;
    return MessageClass.from(fields);
}
