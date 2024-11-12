import { includesMessage, PluginConfig, pluginConfig } from "../helpers/config";
import UbloxMessage from "../messages/UbloxMessage";
import UbloxPluginMessage, {
    UbloxPluginMessageData,
} from "../messages/UbloxPluginMessage";
import UbloxDevice from "../UbloxDevice";

export type PluginName = Lowercase<string>;

export default abstract class UbloxReaderPlugin<
    O extends PluginConfig = PluginConfig
> {
    /**
     * The name of the plugin
     */
    abstract readonly name: PluginName;

    private _device?: UbloxDevice;
    /**
     * Attached device
     */
    get device(): UbloxDevice {
        if (!this._device) {
            throw new Error("Device not attached");
        }
        return this._device;
    }

    /**
     * Boot the plugin
     * @param device The device to attach
     * @returns This plugin
     */
    boot(device: UbloxDevice) {
        if (this._device) {
            throw new Error("Plugin already booted");
        }
        this._device = device;
        return this;
    }
    /**
     * Shutdown the plugin
     */
    shutdown() {
        if (!this._device) {
            throw new Error("Plugin not booted");
        }
        this._device = undefined;
        return this;
    }

    private _log(
        severity: "debug" | "info" | "warn" | "error",
        message: string,
        ...args: unknown[]
    ) {
        console[severity](`[${this.name}] ${message}`, ...args);
        return this;
    }
    debug(message: string, ...args: unknown[]) {
        return this._log("debug", message, ...args);
    }
    info(message: string, ...args: unknown[]) {
        return this._log("info", message, ...args);
    }
    warn(message: string, ...args: unknown[]) {
        return this._log("warn", message, ...args);
    }
    error(message: string, ...args: unknown[]) {
        return this._log("error", message, ...args);
    }

    /**
     * The messages collected by the device
     */
    get messages() {
        return this.device.collector;
    }

    /**
     * Emit a plugin message
     * @param data The data to emit
     * @returns This plugin
     */
    emit<T extends UbloxPluginMessageData>(data: Omit<T, "pluginName">) {
        const msg = new UbloxPluginMessage(this, data);
        this.device.pluginMessage(msg);
        return this;
    }

    /**
     * Setup the plugin
     * Called after initialization, before the device is connected
     */
    setup(): void {}

    /**
     * Teardown the plugin
     * Called before shutdown, after the device is disconnected
     */
    teardown(): void {}

    /**
     * The config for the plugin
     */
    private _config: O | undefined;
    /**
     * Get the config for the plugin
     */
    get config() {
        if (this._config === undefined) {
            this._config = this.readConfig();
        }
        return this._config;
    }

    /**
     * Read the config for the plugin
     * Override this method to set defaults
     */
    readConfig(): O {
        const { name } = this;
        return pluginConfig(name) as O;
    }

    /**
     * Check if the type of a message is included in a specific list of types or the list from the config
     * @param message The message to check
     * @param types The types to check (default list from config)
     * @returns True if the message is included
     */
    includesMessage(
        message: UbloxMessage,
        types = this.config.messages
    ): boolean {
        if (types === undefined) return true;
        return includesMessage(types, message);
    }
}
