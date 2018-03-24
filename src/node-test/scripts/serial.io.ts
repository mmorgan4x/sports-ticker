import * as SerialPort from 'serialport';
import { EventEmitter } from "events";
import { OpenOptions } from "serialport";

export class SerialIO {

    private serialPort: SerialPort;
    private path: string;
    private emitter = new EventEmitter();
    private delimiter = '\n';

    constructor(path: string, openOptions?: OpenOptions) {
        this.path = path;
        openOptions = Object.assign({ autoOpen: false }, openOptions);
        this.serialPort = new SerialPort(this.path, openOptions);

        let parser = this.serialPort.pipe(new SerialPort.parsers.Readline({ delimiter: this.delimiter }));
        parser.on('data', (buffer: Buffer) => {
            // console.log('buffer: ', buffer.toString());
            let msg = this.deserialize(buffer.toString());
            this.emitter.emit(msg.event, msg.args);
        });
    }

    static list() {
        return SerialPort.list();
    }

    async open() {
        return new Promise<string>((resolve, reject) => {
            this.serialPort.open(err => err ? reject(err) : setTimeout(t => resolve(this.path), 2000))
            // this.serialPort.open(err => err ? reject(err) : resolve(this.path))
        })
    }

    close() {
        return new Promise<string>((resolve, reject) => {
            this.serialPort.close(err => err ? reject(err) : resolve(this.path))
        })
    }

    on(event: string, listener: (...args: any[]) => void) {
        return this.emitter.on(event, listener);
    }

    poll(event: string) {
        return new Promise<any[]>((res, rej) => {
            this.emitter.once(event, res);
            // setTimeout(() => rej(new Error('Timed Out')), 3000);
            setTimeout(() => res(), 3000);
        });
    }

    emit(event: string, ...args: any[]) {
        let msg = this.serialize(event, args);
        this.serialPort.write(msg + this.delimiter);
        return true;
    }

    private deserialize(msg: string) {
        let event = msg.substring(0, msg.indexOf(':'));
        let argsStr = msg.substring(msg.indexOf(':') + 1, msg.length);
        let args = argsStr ? argsStr.split(',') : [];
        return { event, args }
    }

    private serialize(event: string, ...args: any[]) {
        return event + ':' + args.join(',');
    }
}