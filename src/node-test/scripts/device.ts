import { SerialIO } from './serial.io';

// const baudRate = 9600;
// const delimiter = '\r\n';

class Device {
    async start() {
        let com = (await SerialIO.list())[0].comName;

        let device = new SerialIO(com, { baudRate: 9600 });
        console.log(`[opened port: ${await device.open()}]`);


        device.on('log', (args: any[]) => {
            console.log(...args);
        })

        let func: any;
        setTimeout(func = async () => {
            device.emit('tick');
            let val = await device.onAsync('tick');
            if (val) {
                console.log(val[0] / 1000);
            }
            setTimeout(func, 1000);
        }, 1000);
    }
}

export let device = new Device();
