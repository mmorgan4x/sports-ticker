import * as SerialPort from 'serialport';
import * as usb from "usb";
import { EventEmitter } from "events";
import { OpenOptions } from "serialport";
type Message = { type: 'req' | 'res', event: string, args?: any[] }

export class SerialIO {

    private serialPort: SerialPort;
    private path: string;
    private requestEmitter = new EventEmitter();
    private responseEmitter = new EventEmitter();
    public events = new EventEmitter();

    constructor(path: string, openOptions?: OpenOptions) {
        this.path = path;
        openOptions = Object.assign({ autoOpen: false }, openOptions);
        this.serialPort = new SerialPort(this.path, openOptions);

        this.serialPort.on('open', t => this.events.emit('open', t));
        this.serialPort.on('close', t => this.events.emit('close', t));
        this.serialPort.on('error', t => this.events.emit('error', t));
        usb.on('attach', t => { this.events.emit('attach', t) });
        usb.on('detach', t => { this.events.emit('detach', t) });

        this.serialPort.on('data', (buffer: Buffer) => {
            // console.log("{\"type\":\"req\",\"event\":\"prn\",\"data\":12}")
            let msg: Message = JSON.parse(buffer.toString());
            if (msg.type == 'req') {
                this.requestEmitter.emit(msg.event, msg.args);
            }
            if (msg.type == 'res') {
                this.responseEmitter.emit(msg.event, msg.args);
            }
        });
    }

    static list() {
        return SerialPort.list();
    }

    open() {
        return new Promise<string>((resolve, reject) => {
            this.serialPort.open(err => err ? reject(err) : resolve(this.path))
        })
    }

    close() {
        return new Promise<string>((resolve, reject) => {
            this.serialPort.close(err => err ? reject(err) : resolve(this.path))
        })
    }

    on(event: string, listener: (...args: any[]) => void) {
        return this.requestEmitter.on(event, listener);
    }
    once(event: string, listener: (...args: any[]) => void) {
        return this.requestEmitter.once(event, listener);
    }
    off(event: string, listener: (...args: any[]) => void) {
        return this.requestEmitter.removeListener(event, listener);
    }

    emit(event: string, ...args: any[]) {
        let msg: Message = { type: 'req', event: event, args: args };
        this.serialPort.write(JSON.stringify(msg));
        return true;
    }

    request(event: string, ...args: any[]) {
        let response = new Promise<any[]>((resolve, reject) => {
            let successFn: (data) => void;
            let errorFn: (err) => void;

            successFn = (args) => {
                this.responseEmitter.removeListener(event, successFn);
                this.responseEmitter.removeListener('error', errorFn);
                resolve(args);
            }

            errorFn = (err) => {
                this.responseEmitter.removeListener(event, successFn);
                this.responseEmitter.removeListener('error', errorFn);
                reject(err);
            }

            this.responseEmitter.on(event, successFn);
            this.responseEmitter.on('error', errorFn);
            setTimeout(() => errorFn(new Error('Request Timed Out')), 3000);
        });

        let msg: Message = { type: 'req', event: event, args: args };
        this.serialPort.write(JSON.stringify(msg));
        return response;
    }

    respond(event: string, ...args: any[]) {
        let msg: Message = { type: 'res', event: event, args: args };
        this.serialPort.write(JSON.stringify(msg));
    }
}