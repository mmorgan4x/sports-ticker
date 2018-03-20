"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var port = 80;
var Server = /** @class */ (function () {
    function Server() {
    }
    Server.prototype.start = function () {
        app.get('/', function (req, res) {
            res.send('Hello World!');
        });
        app.listen(port, function () {
            console.log("[starting server on port " + port + "]");
        });
    };
    return Server;
}());
exports.server = new Server();
