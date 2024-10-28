import UbloxDevice from "./UbloxDevice";
import findSerialDevices from "./helpers/findSerialDevices";
import exitHook from "exit-hook";
import { deviceConfig, listEnabledPlugins } from "./helpers/config";
import allPlugins from "./helpers/allPlugins";

async function main() {
    const { baudRate, navRate, type: pid, path } = deviceConfig();

    // get the device
    let device: UbloxDevice;
    if (pid && path) {
        device = new UbloxDevice(
            { path, pid },
            {
                baudRate,
                navRate,
            }
        );
    } else {
        const devices = await findSerialDevices();
        if (devices.length === 0) {
            console.error("No serial devices found");
            process.exit(1);
        }
        // take the first device found
        device = new UbloxDevice(devices[0], {
            baudRate,
            navRate,
        });
    }

    // get all plugins and setup the ones which are enabled
    const enabledPluginNames = listEnabledPlugins();
    const plugins = allPlugins().filter((plugin) => {
        const enabled = enabledPluginNames.includes(plugin.name);
        console.log(
            `Loaded plugin: ${plugin.name} - status: ${
                enabled ? "enabled" : "disabled"
            }`
        );
        return enabled;
    });
    plugins.forEach((plugin) => {
        console.log(`Setting up plugin: ${plugin.name}`);
        try {
            plugin.setup(device);
        } catch (error) {
            console.error(
                `Error setting up plugin ${plugin.name}: ${error as Error}`
            );
        }
    });

    // exit cleanly
    exitHook(() => {
        console.log(`Disconnecting from device at ${device.device.path}`);
        device.disconnect();
        plugins.forEach((plugin) => {
            console.log(`Tearing down plugin: ${plugin.name}`);
            try {
                plugin.teardown();
            } catch (error) {
                console.error(
                    `Error tearing down plugin ${plugin.name}: ${
                        error as Error
                    }`
                );
            }
        });
    });

    // connect the device
    console.log(`Connecting to device at ${device.device.path}`);
    device.connect();
}

main().catch((error) => {
    console.error(`Error: ${error as Error}`);
    process.exit(1);
});
