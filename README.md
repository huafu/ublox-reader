# ublox-reader

Node.js implementation of message parsing from U-Blox GPS usb devices.

Application configuration settings are in the `config.yaml` (copy from `config.example.yaml`)

The application will search all serial ports to find a U-BLOX gps device and use a found port if no
specific device configured in the config.
