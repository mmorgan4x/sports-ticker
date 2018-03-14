import { Gpio } from 'onoff';

console.log('starting...');

let led = new Gpio(17, 'out');
let state = false;

(async () => {
  setInterval(t => {
    state = !state;
    led.writeSync(state ? 1 : 0);
    console.log(state ? 'on' : 'off')
  }, 1000)
})();