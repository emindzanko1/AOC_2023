import fs from 'fs';

function gcd(a, b) {
  if (a < b) {
    const tmp = b;
    b = a;
    a = tmp;
  }
  const t = a % b;
  return t ? gcd(b, t) : b;
}

function lcm(arr) {
  let n = 1;
  for (let i = 0; i < arr.length; i++) {
    n = (arr[i] / gcd(arr[i], n)) * n;
  }
  return n;
}

const input = fs.readFileSync('input.txt', 'utf-8');
const lines = input.split('\r\n');

const modules = {};

for (const line of lines) {
  if (line.startsWith('&')) {
    let [name, destModules] = line.split(' -> ');
    name = name.substring(1);
    modules[name] = { destModules: destModules.split(', '), type: 'conjunction', pulses: {} };
  }
}

for (const line of lines) {
  if (line.startsWith('&')) continue;

  let [name, destModules] = line.split(' -> ');
  destModules = destModules.split(', ');

  if (line.startsWith('broadcaster')) {
    modules[name] = { destModules, type: 'broadcaster' };
  } else {
    name = name.substring(1);
    modules[name] = { destModules, type: 'flipflop', on: false };
    for (const m of destModules) {
      if (modules[m] && modules[m].type === 'conjunction') {
        modules[m].pulses[name] = 'low';
      }
    }
  }
}

const selectedModules = ['th', 'sv', 'gh', 'ch'];

for (const sm of selectedModules) {
  let presses = 0;
  let timesFound = 0;
  main: while (true) {
    const queue = [];

    presses++;

    for (const dm of modules.broadcaster.destModules) {
      queue.push({ from: 'broadcaster', to: dm, pulse: 'low' });
    }

    while (queue.length > 0) {
      const sender = queue.shift();
      const name = sender.to;
      const module = modules[name];

      if (name === sm && sender.pulse === 'low') {
        console.log(`${sm} at ${presses}`);
        timesFound++;
        if (timesFound > 2) {
          break main;
        }
      }

      if (module === undefined || (module.type === 'flipflop' && sender.pulse === 'high')) continue;

      let sendingPulse = null;

      if (module.type === 'flipflop' && sender.pulse === 'low') {
        module.on = !module.on;
        sendingPulse = module.on ? 'high' : 'low';
      } else if (module.type === 'conjunction') {
        modules[name].pulses[sender.from] = sender.pulse;
        sendingPulse = Object.values(module.pulses).every(e => e === 'high') ? 'low' : 'high';
      }

      for (const dm of module.destModules) {
        queue.push({ from: name, to: dm, pulse: sendingPulse });
      }
    }
  }
  console.log();
}

const pressesArr = [3947, 4001, 3943, 3917];

console.log(lcm(pressesArr));
