import { PluginConfig, pluginConfig } from "../helpers/config";
import UbloxDevice from "../UbloxDevice";

export default abstract class UbloxReaderPlugin<O extends PluginConfig> {
    /**
     * The name of the plugin
     */
    abstract readonly name: string;

    /**
     * Setup the plugin
     * Called after initialization, before the device is connected
     */
    setup(_device: UbloxDevice): void {}

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
            this._config = this.readOptions();
        }
        return this._config;
    }

    /**
     * Read the config for the plugin
     */
    protected readOptions(): O {
        const { name } = this;
        return pluginConfig(name) as O;
    }
}
