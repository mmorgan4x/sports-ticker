"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SerialPort = require("serialport");
var usb = require("usb");
var events_1 = require("events");
var SerialIO = /** @class */ (function () {
    function SerialIO(path, openOptions) {
        var _this = this;
        this.requestEmitter = new events_1.EventEmitter();
        this.responseEmitter = new events_1.EventEmitter();
        this.events = new events_1.EventEmitter();
        this.path = path;
        openOptions = Object.assign({ autoOpen: false }, openOptions);
        this.serialPort = new SerialPort(this.path, openOptions);
        this.serialPort.on('open', function (t) { return _this.events.emit('open', t); });
        this.serialPort.on('close', function (t) { return _this.events.emit('close', t); });
        this.serialPort.on('error', function (t) { return _this.events.emit('error', t); });
        usb.on('attach', function (t) { _this.events.emit('attach', t); });
        usb.on('detach', function (t) { _this.events.emit('detach', t); });
        this.serialPort.on('data', function (buffer) {
            // console.log("{\"type\":\"req\",\"event\":\"prn\",\"data\":12}")
            var msg = JSON.parse(buffer.toString());
            if (msg.type == 'req') {
                _this.requestEmitter.emit(msg.event, msg.args);
            }
            if (msg.type == 'res') {
                _this.responseEmitter.emit(msg.event, msg.args);
            }
        });
    }
    SerialIO.list = function () {
        return SerialPort.list();
    };
    SerialIO.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.serialPort.open(function (err) { return err ? reject(err) : resolve(_this.path); });
        });
    };
    SerialIO.prototype.close = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.serialPort.close(function (err) { return err ? reject(err) : resolve(_this.path); });
        });
    };
    SerialIO.prototype.on = function (event, listener) {
        return this.requestEmitter.on(event, listener);
    };
    SerialIO.prototype.once = function (event, listener) {
        return this.requestEmitter.once(event, listener);
    };
    SerialIO.prototype.off = function (event, listener) {
        return this.requestEmitter.removeListener(event, listener);
    };
    SerialIO.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var msg = { type: 'req', event: event, args: args };
        this.serialPort.write(JSON.stringify(msg));
        return true;
    };
    SerialIO.prototype.request = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var response = new Promise(function (resolve, reject) {
            var successFn;
            var errorFn;
            successFn = function (args) {
                _this.responseEmitter.removeListener(event, successFn);
                _this.responseEmitter.removeListener('error', errorFn);
                resolve(args);
            };
            errorFn = function (err) {
                _this.responseEmitter.removeListener(event, successFn);
                _this.responseEmitter.removeListener('error', errorFn);
                reject(err);
            };
            _this.responseEmitter.on(event, successFn);
            _this.responseEmitter.on('error', errorFn);
            setTimeout(function () { return errorFn(new Error('Request Timed Out')); }, 3000);
        });
        var msg = { type: 'req', event: event, args: args };
        this.serialPort.write(JSON.stringify(msg));
        return response;
    };
    SerialIO.prototype.respond = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var msg = { type: 'res', event: event, args: args };
        this.serialPort.write(JSON.stringify(msg));
    };
    return SerialIO;
}());
exports.SerialIO = SerialIO;
