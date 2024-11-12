import { SentenceId } from "../constants";
import UbloxReaderPlugin, { PluginName } from "../plugins/UbloxReaderPlugin";
import UbloxMessage from "./UbloxMessage";

export interface UbloxPluginMessageData {
    readonly pluginName: PluginName;
    [key: string]: string | number;
}

export default class UbloxPluginMessage<
    T extends UbloxPluginMessageData = UbloxPluginMessageData
> extends UbloxMessage<SentenceId.plugin, T> {
    static readonly sentenceId = SentenceId.plugin;
    static readonly sentenceName = "Plugin specific message";
    static readonly cid = 0x00;
    static readonly mid = 0x00;

    constructor(plugin: UbloxReaderPlugin, data: Omit<T, "pluginName">) {
        super({
            ...data,
            pluginName: plugin.name,
        } as T);
    }

    isOf<T extends UbloxReaderPlugin>(plugin: string | T): plugin is T {
        return typeof plugin === "string"
            ? this.data.pluginName === plugin
            : this.data.pluginName === plugin.name;
    }

    get pluginName() {
        return this.data.pluginName;
    }
}

UbloxMessage.registerClass(UbloxPluginMessage);
