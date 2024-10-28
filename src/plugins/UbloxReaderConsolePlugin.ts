import { SentenceId } from "../constants";
import { PluginConfig } from "../helpers/config";
import UbloxMessage from "../messages/UbloxMessage";
import UbloxDevice from "../UbloxDevice";
import UbloxReaderPlugin from "./UbloxReaderPlugin";

export interface UbloxReaderConsolePluginConfig extends PluginConfig {
    messages?: SentenceId[];
}

export default class UbloxReaderConsolePlugin extends UbloxReaderPlugin<UbloxReaderConsolePluginConfig> {
    readonly name = "console";

    setup(device: UbloxDevice) {
        const { messages } = this.config;
        if (messages) {
            messages.forEach((message) => {
                device.onMessageOfType(message, this.handleMessage.bind(this));
            });
        } else {
            device.on("message", this.handleMessage.bind(this));
        }
    }

    handleMessage(message: UbloxMessage) {
        console.log(JSON.stringify(message));
    }
}
