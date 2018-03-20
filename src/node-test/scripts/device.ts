import * as  SerialPort from 'serialport';

const baudRate = 9600;
const delimiter = '\r\n';

class Device {
    reconnectInterval: any;

    async start() {
        let com = (await SerialPort.list())[0].comName;

        let port = new SerialPort(com, { baudRate: baudRate });
        let parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: delimiter }));

        port.on('open', t => {
            console.log(`[opening ${com}...]`);
        });
        parser.on('data', data => {
            console.log('Data:', data);
        });

        port.on('error', err => {
            console.log('error port: ' + err)
        });
        parser.on('error', err => {
            console.log('error parser:', err);
        });
        port.on('close', err => {
            console.log('close port: ' + err)
        })
        parser.on('close', err => {
            console.log('close parser: ' + err)
        })
    }
}

export let device = new Device();
