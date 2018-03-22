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
var serial_io_1 = require("./serial.io");
// const baudRate = 9600;
// const delimiter = '\r\n';
var Device = /** @class */ (function () {
    function Device() {
    }
    Device.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var com, device, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, serial_io_1.SerialIO.list()];
                    case 1:
                        com = (_d.sent())[0].comName;
                        device = new serial_io_1.SerialIO(com, { baudRate: 115200 });
                        _b = (_a = console).log;
                        _c = "[opened port: ";
                        return [4 /*yield*/, device.open()];
                    case 2:
                        _b.apply(_a, [_c + (_d.sent()) + "]"]);
                        _d.label = 3;
                    case 3:
                        if (!true) return [3 /*break*/, 8];
                        console.log('high');
                        device.emit('digitalWrite', 13, 'HIGH');
                        return [4 /*yield*/, device.poll('digitalWrite')];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, new Promise(function (t) { return setTimeout(t, 500); })];
                    case 5:
                        _d.sent();
                        console.log('low');
                        device.emit('digitalWrite', 13, 'LOW');
                        return [4 /*yield*/, device.poll('digitalWrite')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, new Promise(function (t) { return setTimeout(t, 500); })];
                    case 7:
                        _d.sent();
                        return [3 /*break*/, 3];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return Device;
}());
exports.device = new Device();
