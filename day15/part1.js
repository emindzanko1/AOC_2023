import fs from 'fs';

function hash(s) {
  let curr = 0;
  for (const c of s) {
    curr += c.charCodeAt(0);
    curr *= 17;
    curr %= 256;
  }
  return curr;
}

const input = fs.readFileSync('input.txt', 'utf8');
const lines = input.split('\n').map(line => line.trim());

let total = 0;
const line = lines[0].split(',');
for (const l of line) {
  total += hash(l);
}

console.log(total);
