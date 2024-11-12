import { PluginConfig } from "../helpers/config";
import UbloxMessage from "../messages/UbloxMessage";
import UbloxReaderPlugin from "./UbloxReaderPlugin";

export interface UbloxReaderConsolePluginConfig extends PluginConfig {
    severity?: "debug" | "info" | "warn" | "error";
}

export default class UbloxReaderConsolePlugin extends UbloxReaderPlugin<UbloxReaderConsolePluginConfig> {
    readonly name = "console";

    setup() {
        this.device.on("message", this.handleMessage.bind(this));
    }

    handleMessage(message: UbloxMessage) {
        const severity = this.config.severity!;
        if (!this.includesMessage(message)) return;
        this[severity](JSON.stringify(message));
    }

    readConfig(): UbloxReaderConsolePluginConfig {
        return {
            severity: "info",
            ...super.readConfig(),
        };
    }
}
