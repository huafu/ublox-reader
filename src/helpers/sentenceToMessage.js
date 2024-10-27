import UbloxMessage from "../messages/UbloxMessage.js";
import "../messages/UbloxDtmMessage.js";
import "../messages/UbloxGbsMessage.js";
import "../messages/UbloxGgaMessage.js";
import "../messages/UbloxGllMessage.js";
import "../messages/UbloxGnsMessage.js";
import "../messages/UbloxGrsMessage.js";
import "../messages/UbloxGsaMessage.js";
import "../messages/UbloxGstMessage.js";
import "../messages/UbloxGsvMessage.js";
import "../messages/UbloxRmcMessage.js";
import "../messages/UbloxThsMessage.js";
import "../messages/UbloxTxtMessage.js";
import "../messages/UbloxUbx00Message.js";
import "../messages/UbloxUbx03Message.js";
import "../messages/UbloxUbx04Message.js";
import "../messages/UbloxVlwMessage.js";
import "../messages/UbloxVtgMessage.js";
import "../messages/UbloxZdaMessage.js";

/**
 * Parse a sentence into a message object
 * @param {string} sentence
 * @returns {UbloxMessage|undefined}
 */
export default function sentenceToMessage(sentence) {
    /** @type {string[]} */
    let fields;
    /** @type {import("./constants.js").SentenceId} */
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
