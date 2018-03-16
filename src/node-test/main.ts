import * as request from 'request-promise';
import { utils } from './utils';
import { server } from './server';

console.log('[starting app...]');
server.start();

(async () => {
  for (let i = 1; i < 33; i++) {
    try {
      let res = JSON.parse(await request.get(utils.getTeamInfo(i)))
      console.log(res.location);
    }
    catch {
      console.log('err');
    }
  }
})();