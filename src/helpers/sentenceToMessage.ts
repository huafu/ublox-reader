import UbloxMessage from "../messages/UbloxMessage";
import "../messages/UbloxDtmMessage";
import "../messages/UbloxGbsMessage";
import "../messages/UbloxGgaMessage";
import "../messages/UbloxGllMessage";
import "../messages/UbloxGnsMessage";
import "../messages/UbloxGrsMessage";
import "../messages/UbloxGsaMessage";
import "../messages/UbloxGstMessage";
import "../messages/UbloxGsvMessage";
import "../messages/UbloxRmcMessage";
import "../messages/UbloxThsMessage";
import "../messages/UbloxTxtMessage";
import "../messages/UbloxUbx00Message";
import "../messages/UbloxUbx03Message";
import "../messages/UbloxUbx04Message";
import "../messages/UbloxVlwMessage";
import "../messages/UbloxVtgMessage";
import "../messages/UbloxZdaMessage";
import { SentenceId } from "../constants";

/**
 * Parse a sentence into a message object
 */
export default function sentenceToMessage<T extends SentenceId>(
    sentence: string
): UbloxMessage<T> | undefined {
    let fields: string[];
    let sentenceId: string;

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

    const MessageClass = UbloxMessage.ClassForSentenceId(
        sentenceId as SentenceId
    );
    if (!MessageClass) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return MessageClass.from(fields) as UbloxMessage<T>;
}
