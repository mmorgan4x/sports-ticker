"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var device_1 = require("./scripts/device");
console.log('[starting app...]');
// server.start();
device_1.device.start();
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
