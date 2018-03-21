"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var SerialPort = require("serialport");
var events_1 = require("events");
var SerialIO = /** @class */ (function () {
    function SerialIO(path, openOptions) {
        var _this = this;
        this.emitter = new events_1.EventEmitter();
        this.path = path;
        openOptions = Object.assign({ autoOpen: false }, openOptions);
        this.serialPort = new SerialPort(this.path, openOptions);
        var parser = this.serialPort.pipe(new SerialPort.parsers.Readline({ delimiter: '\r\n' }));
        parser.on('data', function (buffer) {
            // console.log('buffer: ', buffer.toString());
            var msg = _this.deserialize(buffer.toString());
            _this.emitter.emit(msg.event, msg.args);
        });
    }
    SerialIO.list = function () {
        return SerialPort.list();
    };
    SerialIO.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.serialPort.open(function (err) { return err ? reject(err) : setTimeout(function (t) { return resolve(_this.path); }, 2000); });
                    })];
            });
        });
    };
    SerialIO.prototype.close = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.serialPort.close(function (err) { return err ? reject(err) : resolve(_this.path); });
        });
    };
    SerialIO.prototype.on = function (event, listener) {
        return this.emitter.on(event, listener);
    };
    SerialIO.prototype.onAsync = function (event) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.emitter.once(event, res);
            // setTimeout(() => rej(new Error('Timed Out')), 3000);
            setTimeout(function () { return res(); }, 3000);
        });
    };
    SerialIO.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var msg = this.serialize(event, args);
        this.serialPort.write(msg + '\r\n');
        return true;
    };
    SerialIO.prototype.deserialize = function (msg) {
        var event = msg.substring(0, msg.indexOf(':'));
        var argsStr = msg.substring(msg.indexOf(':') + 1, msg.length);
        var args = argsStr ? argsStr.split(',') : [];
        return { event: event, args: args };
    };
    SerialIO.prototype.serialize = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return event + ':' + args.join(',');
    };
    return SerialIO;
}());
exports.SerialIO = SerialIO;
