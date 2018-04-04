import { SerialIO } from './serial.io';

// const baudRate = 9600;
// const delimiter = '\r\n';
// type Pin = number | 'A1' | 'A2';
type InterruptMode = 'LOW' | 'CHANGE' | 'RISING' | 'FALLING' | 'HIGH';

export class Arduino {

    private serial: SerialIO;

    constructor() { }

    async connect() {
        let com = (await SerialIO.list())[0].comName;

        this.serial = new SerialIO(com, { baudRate: 115200 });
        console.log(`[ardino opened port: ${await this.serial.open()}]`);

        this.serial.on('println', t => console.log(t && t[0]))
    }

    async delay(duration: number) {
        return await new Promise(t => setTimeout(t, duration));
    }

    async println(val: any) {
        return console.log(val);
    }

    async ping() {
        this.serial.emit('ping');
        await this.serial.poll('pong');
    }

    async pinMode(pin: number, mode: 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP') {
        this.serial.emit('pinMode', pin, mode);
        await this.serial.poll('pinMode');
    }

    async digitalWrite(pin: number, value: boolean | 'HIGH' | 'LOW') {
        value = (value == false || value == 'LOW' ? 'LOW' : 'HIGH');
        this.serial.emit('digitalWrite', pin, value);
        await this.serial.poll('digitalWrite');
    }

    async digitalRead(pin: number) {
        this.serial.emit('digitalRead', pin);
        let vals = (await this.serial.poll('digitalRead'));
        return vals[0] == '1';
    }

    async analogWrite(pin: number, value: number) {
        this.serial.emit('analogWrite', pin, value);
        await this.serial.poll('analogWrite');
    }

    async analogRead(pin: number) {
        this.serial.emit('analogRead', pin);
        let vals = (await this.serial.poll('analogRead'));
        return +vals[0];
    }

    async millis() {
        this.serial.emit('millis');
        let vals = (await this.serial.poll('millis'));
        return +vals[0];
    }

    async micros() {
        this.serial.emit('micros');
        let vals = (await this.serial.poll('micros'));
        return +vals[0];
    }

    async attachInterrupt(pin: number, mode: InterruptMode, ISR: Function) {
        this.serial.emit('attachInterrupt', pin, mode);
        this.serial.on(`interrupt${pin}`, () => ISR());
        await this.serial.poll('attachInterrupt');
    }

    async detachInterrupt(pin: number) {
        this.serial.emit('detachInterrupt', pin);
        this.serial.off(`interrupt${pin}`);
        await this.serial.poll('detachInterrupt');
    }

    async noInterrupts() {
        this.serial.emit('noInterrupts');
        await this.serial.poll('noInterrupts');
    }

    async interrupts() {
        this.serial.emit('interrupts');
        await this.serial.poll('interrupts');
    }
}
