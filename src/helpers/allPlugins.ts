import UbloxReaderConsolePlugin from "../plugins/UbloxReaderConsolePlugin";
import UbloxReaderMqttPlugin from "../plugins/UbloxReaderMqttPlugin";
import UbloxReaderPlugin from "../plugins/UbloxReaderPlugin";
import UbloxReaderTpvPlugin from "../plugins/UbloxReaderTpvPlugin";
import { PluginConfig } from "./config";

export default function allPlugins(): UbloxReaderPlugin<PluginConfig>[] {
    return [
        new UbloxReaderConsolePlugin(),
        new UbloxReaderMqttPlugin(),
        new UbloxReaderTpvPlugin(),
    ];
}
