"use strict";

const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const favicon = require('serve-favicon');
const settings = require("./settings.js");
const main = require("./main.js");

const connections = {};

exports.runServers = function() {
    var app = express();
    try {
        app.use(express.urlencoded({ extended: true }));
        app.listen(settings.httpport, () => {
            console.log(`Http web server is listening on port ${settings.httpport}`);
        });
        
        var options = {
            dotfiles: 'ignore',
            etag: false,
            extensions: ['html'],
            index: false,
            redirect: false,
            setHeaders: function (res, path, stat) {
                res.set('x-timestamp', Date.now());
            }
        };

        app.use(express.static(`${__dirname}/public`, options));
        app.use(favicon(`${__dirname}/public/favicon.png`));

        app.get('/',(req, res) => {
            res.sendFile(`${__dirname}/public/index.html`);
        });

        app.post("/msgselect", (req, res) => {
            main.selectMessages(req.body);
            res.writeHead(200);
            res.end();
        });

        runWebsockServer();
    }
    catch (error) {
        console.log(error);
    }
}

function runWebsockServer() {
    var server = http.createServer();
    var wss = new WebSocketServer({ server });
    server.listen(settings.wsport, () => {});

    console.log(`Data forwarding websocket server established on port ${settings.wsport}`); 

    wss.on("connection", (wsconn) => {
        const id = Date.now();
        connections[id] = wsconn;
        wsconn.send("CONNECTED TO WEBSOCKET SERVER!")
    
        wsconn.on("close", function () {
            console.log("connection closed");
            for(let id in connections) {
                let cn = connections[id];
                if (cn === wsconn) {
                    delete connections[id];
                    break;
                }
            }
        });

        wsconn.on("message", (message) => { 
            var data = message.toString();
            main.selectMessages(JSON.parse(data));
        });
    });
}

exports.sendDataToBrowser = function(data) {
    try {
        for(let id in connections) {
            connections[id].send(data);
        };
    }
    finally{}
}

