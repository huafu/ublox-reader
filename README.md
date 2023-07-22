# ublox-reader
Node.js implementation of message parsing from U-Blox GPS usb devices.

Application configuration settings are in the settings.js file.

Serves an HTML page with message type checkbox selection(s) and message data updated via websocket.

Open browser and navigate to localhost:5000 (or whatever port is indicated in settings.js)

The application will search all serial ports to find a U-BLOX gps device and use a found port.


## To Install:
Clone repository, open terminal and enter ***npm install*** then run in terminal with command ***node main***

***NOTE:*** 
User selected GPS messages from the web page are also output to the console in json format. 

