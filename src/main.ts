import UbloxDevice from "./UbloxDevice";
import findSerialDevices from "./helpers/findSerialDevices";
import exitHook from "exit-hook";
import { deviceConfig } from "./helpers/config";
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
    const plugins = allPlugins().filter((plugin) => {
        const config = plugin.config;
        return !config.disabled;
    });
    plugins.forEach((plugin) => plugin.setup(device));

    // exit cleanly
    exitHook(() => {
        device.disconnect();
        plugins.forEach((plugin) => plugin.teardown());
    });

    // connect the device
    device.connect();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
