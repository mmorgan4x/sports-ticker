import { SerialIO } from './serial.io';

// const baudRate = 9600;
// const delimiter = '\r\n';

class Device {
    async start() {
        let com = (await SerialIO.list())[0].comName;

        let device = new SerialIO(com, { baudRate: 115200 });
        console.log(`[opened port: ${await device.open()}]`);


        while (true) {
            console.log('read')
            device.emit('digitalRead', 6);
            let val = (await device.poll('digitalRead'));
            console.log(val);
            await new Promise(t => setTimeout(t, 500));
        }
    }
}

export let device = new Device();
