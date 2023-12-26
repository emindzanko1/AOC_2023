import fs from 'fs';
const input = fs.readFileSync('input.txt', 'utf8');
const lines = input
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const [direction, length] = line.split(' ');
    return [direction, parseInt(length)];
  });

let signedArea = 0;
let perimeter = 0;
let y = 0;
let x = 0;

const DIRECTIONS = {
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
  U: [-1, 0],
};

for (const [direction, length] of lines) {
  perimeter += length;

  const [dy, dx] = DIRECTIONS[direction];
  const new_y = y + dy * length;
  const new_x = x + dx * length;

  signedArea += (y + new_y) * (x - new_x);

  y = new_y;
  x = new_x;
}
console.log(Math.floor(signedArea / 2 + perimeter / 2 + 1));
