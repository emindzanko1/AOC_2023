import fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');

const lines = input.trim().split('\n');
const plan = [];

const DIRECTIONS = {
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
  U: [-1, 0],
};
const DIRECTIONS_LIST = Object.keys(DIRECTIONS);

lines.forEach(line => {
  const parts = line.trim().split(' ');
  const color = parts[2];
  const direction = DIRECTIONS_LIST[parseInt(color.slice(-2))];
  const length = parseInt(color.slice(2, -2), 16);
  plan.push([direction, length]);
});

let signedArea = 0;
let perimeter = 0;

let y = 0;
let x = 0;

plan.forEach(([direction, length]) => {
  perimeter += length;

  const [dy, dx] = DIRECTIONS[direction];
  const new_y = y + dy * length;
  const new_x = x + dx * length;

  signedArea += (y + new_y) * (x - new_x);

  y = new_y;
  x = new_x;
});

console.log(Math.floor(signedArea / 2 + perimeter / 2 + 1));
