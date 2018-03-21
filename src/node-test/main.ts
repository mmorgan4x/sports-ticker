import * as request from 'request-promise';
import { utils } from './scripts/utils';
import { server } from './scripts/server';
import { device } from './scripts/device';
import { SerialIO } from './scripts/serial.io';

console.log('[starting app...]');
// server.start();
// device.start();



// (async () => {
//   for (let i = 1; i < 33; i++) {
//     try {
//       let res = JSON.parse(await request.get(utils.getTeamInfo(i)))
//       console.log(res.location);
//     }
//     catch {
//       console.log('err');
//     }
//   }
// })();

(async () => {
    let device = new SerialIO('COM15');
    console.log('opened: ', await device.open());
    device.on('prn', t => {
        console.log('hey')
    })
})();