import { SerialIO } from './serial.io';
import { Arduino } from './arduino';

// const baudRate = 9600;
// const delimiter = '\r\n';

class Device {
    async start() {
        let arduino = new Arduino();
        await arduino.connect();

        let state = true;
        setInterval(t => state = !state, 500);

        while (true) {
            await arduino.digitalWrite(13, state);
        }
    }
}

export let device = new Device();
