import fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');

const lines = input.trim().split(/\r?\n/gm);
const map = new Map();
let start;

for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[0].length; x++) {
    const char = lines[y][x];
    if (char === '.' || char === 'S') {
      map.set(`${x}, ${y}`, 0);
      if (char === 'S') {
        start = `${x}, ${y}`;
      }
    }
  }
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

const width = lines[0].length;
const height = lines.length;
const toVisit = new Map([[start, 0]]);
const needed = 26501365;
const afterNeeded = needed + 1;
const twoWidth = width * 2;
const modulo = afterNeeded % twoWidth;
let good = 0;
let onestep = 0;
const validationRounds = 2;


for (const value of toVisit) {
  const [point, step] = value;
  if (onestep < step && step > width * 2) {
    const uv = [...new Set(map.values())].filter(x => x !== 0).sort((a, b) => a - b);
    const groups = [...map.values()]
      .filter(x => x !== 0)
      .reduce((acc, cur) => {
        if (!acc[cur]) {
          acc[cur] = 1;
        } else {
          acc[cur]++;
        }
        return acc;
      }, {});

    if (uv.length === 3) {
      const seed =
        step % twoWidth === width ? Math.floor(2 * (step / twoWidth)) - 1 : Math.floor(2 * (step / twoWidth));

      if (seed > validationRounds && step % twoWidth === modulo) {
        const neededSeed =
          modulo === width ? Math.floor(2 * (afterNeeded / twoWidth)) - 1 : Math.floor(2 * (afterNeeded / twoWidth));
        const groupKeys = Object.keys(groups);
        console.log(
          groups[groupKeys[0]] * neededSeed ** 2 +
            groups[groupKeys[1]] * (neededSeed ** 2 + neededSeed) +
            groups[groupKeys[2]] * (neededSeed ** 2 + neededSeed + neededSeed + 1)
        );
        break;
      }
    }
    onestep = step;
  }

  const [curX, curY] = point.split(', ').map(Number);
  if (step % 2 === 1) {
    good++;
    const realX = mod(curX, width);
    const realY = mod(curY, height);
    map.set(`${realX}, ${realY}`, map.get(`${realX}, ${realY}`) + 1);
  }

  for (const [xChange, yChange] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nextX = curX + xChange;
    const nextY = curY + yChange;
    const nextPoint = `${nextX}, ${nextY}`;
    const realX = mod(nextX, width);
    const realY = mod(nextY, height);
    if (map.has(`${realX}, ${realY}`) && !toVisit.has(nextPoint)) {
      toVisit.set(nextPoint, step + 1);
    }
  }
}

