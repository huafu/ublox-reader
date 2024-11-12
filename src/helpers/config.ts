import { readFileSync } from "node:fs";
import yaml from "js-yaml";
import { NavRate, ProductId, SentenceId } from "../constants";
import UbloxMessage from "../messages/UbloxMessage";
import UbloxPluginMessage from "../messages/UbloxPluginMessage";

export interface DeviceConfig {
    path?: string; // /dev/ttyACM0
    type?: ProductId; // u-blox7
    baudRate?: number; // 9600
    navRate?: NavRate; // 1
}

export type MessageType =
    | Lowercase<Exclude<SentenceId, SentenceId.plugin>>
    | `plugin:${Lowercase<string>}`;

export interface PluginConfig {
    disabled?: boolean;
    messages?: MessageType[];
    [key: string]: unknown;
}

export interface UbloxPluginConfigMap {
    [key: string]: PluginConfig;
}

export interface Config {
    device: DeviceConfig;
    plugins: UbloxPluginConfigMap;
}

let config: Config;
function getConfig(): Config {
    if (!config) {
        config = yaml.load(readFileSync("config.yaml", "utf8")) as Config;
        if (!config.plugins) {
            throw new Error(
                "At least one plugin must be defined in the config file"
            );
        }
    }
    return config;
}

/**
 * Read a configuration block from the config file
 * @param name The name of the configuration block
 * @returns The configuration block
 */
export function pluginConfig<K extends keyof UbloxPluginConfigMap>(
    name: K
): UbloxPluginConfigMap[K] {
    const plugins = getConfig().plugins;
    if (!plugins[name]) {
        throw new Error(`Plugin "${name}" not found in config file`);
    }
    return plugins[name] ?? { disabled: true };
}

/**
 * Read the device configuration from the config file
 * @returns The device configuration
 */
export function deviceConfig(): DeviceConfig {
    return getConfig().device ?? {};
}

/**
 * List all enabled plugins
 * @returns The list of enabled plugins
 */
export function listEnabledPlugins(): Array<keyof UbloxPluginConfigMap> {
    const plugins = getConfig().plugins ?? {};
    return Object.keys(plugins).filter((key) => !plugins[key]?.disabled);
}

/**
 * Get the type of a message
 * @param message The message
 * @returns The type of the message
 */
export function typeFromMessage(message: UbloxMessage): MessageType {
    if (message instanceof UbloxPluginMessage) {
        return `plugin:${message.pluginName}`;
    }
    return message.sentenceId.toLowerCase() as MessageType;
}

/**
 * Check if the type of a message is included in a list of types
 * @param types The list of types
 * @param message The message
 * @returns True if the message is included
 */
export function includesMessage(types: MessageType[], message: UbloxMessage) {
    const type = typeFromMessage(message);
    return types.includes(type);
}
