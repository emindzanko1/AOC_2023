import fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');

const lines = input.trim().split(/\r?\n/gm);
const map = new Map();
let start;

for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[0].length; x++) {
    const char = lines[y][x];
    if (char === '.' || char === 'S') {
      map.set(`${x}, ${y}`, { x, y });
      if (char === 'S') {
        start = `${x}, ${y}`;
      }
    }
  }
}

const toVisit = new Map([[start, 0]]);
const visited = new Map();
const totalSteps = 64;

for (const [point, step] of toVisit) {
  if (step > totalSteps) continue;
  if (visited.has(point)) {
    continue;
  }
  visited.set(point, step);
  const [curX, curY] = point.split(', ').map(Number);
  for (const [xChange, yChange] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nextX = curX + xChange;
    const nextY = curY + yChange;
    const nextPoint = `${nextX}, ${nextY}`;
    if (map.has(nextPoint) && !visited.has(nextPoint) && !toVisit.has(nextPoint)) {
      toVisit.set(nextPoint, step + 1);
    }
  }
}

console.log([...visited.values()].filter(x => x % 2 === 0).length);
