import { SerialIO } from './serial.io';

// const baudRate = 9600;
// const delimiter = '\r\n';
// type Pin = number | 'A1' | 'A2';

export class Arduino {

    private arduino: SerialIO;

    constructor() { }

    async connect() {
        let com = (await SerialIO.list())[0].comName;

        this.arduino = new SerialIO(com, { baudRate: 115200 });
        console.log(`[ardino opened port: ${await this.arduino.open()}]`);
    }

    async delay(duration: number) {
        return await new Promise(t => setTimeout(t, duration));
    }

    async println(val: any) {
        return console.log(val);
    }

    async ping() {
        this.arduino.emit('ping');
        await this.arduino.poll('pong');
    }

    async pinMode(pin: number, mode: 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP') {
        this.arduino.emit('pinMode', pin, mode);
        await this.arduino.poll('pinMode');
    }

    async digitalWrite(pin: number, value: boolean | 'HIGH' | 'LOW') {
        value = (value == false || value == 'LOW' ? 'LOW' : 'HIGH');
        this.arduino.emit('digitalWrite', pin, value);
        await this.arduino.poll('digitalWrite');
    }

    async digitalRead(pin: number) {
        this.arduino.emit('digitalRead', pin);
        let vals = (await this.arduino.poll('digitalRead'));
        return vals[0] == '1';
    }

    async analogWrite(pin: number, value: number) {
        this.arduino.emit('analogWrite', pin, value);
        await this.arduino.poll('analogWrite');
    }

    async analogRead(pin: number) {
        this.arduino.emit('analogRead', pin);
        let vals = (await this.arduino.poll('analogRead'));
        return +vals[0];
    }

    async millis() {
        this.arduino.emit('millis');
        let vals = (await this.arduino.poll('millis'));
        return +vals[0];
    }

    async micros() {
        this.arduino.emit('micros');
        let vals = (await this.arduino.poll('micros'));
        return +vals[0];
    }
}
