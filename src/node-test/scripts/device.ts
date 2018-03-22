import { SerialIO } from './serial.io';

// const baudRate = 9600;
// const delimiter = '\r\n';

class Device {
    async start() {
        let com = (await SerialIO.list())[0].comName;

        let device = new SerialIO(com, { baudRate: 115200 });
        console.log(`[opened port: ${await device.open()}]`);


        while (true) {
            console.log('high')
            device.emit('digitalWrite', 13, 'HIGH');
            await device.poll('digitalWrite');
            await new Promise(t => setTimeout(t, 500));
            console.log('low')
            device.emit('digitalWrite', 13, 'LOW');
            await device.poll('digitalWrite');
            await new Promise(t => setTimeout(t, 500));
        }
    }
}

export let device = new Device();
