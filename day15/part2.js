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

const boxes = Array.from({ length: 256 }, () => []);

let total = 0;

for (const l of lines[0].split(',')) {
  if (l.includes('-')) {
    const [label] = l.split('-');
    const boxNum = hash(label);
    const newBoxes = boxes[boxNum].filter(b => !b.includes(label));
    boxes[boxNum] = newBoxes;
  }

  if (l.includes('=')) {
    let replaced = false;
    const [label, lensNum] = l.split('=');
    const boxNum = hash(label);
    const newBoxes = boxes[boxNum].map(b => {
      if (b.includes(label) && !replaced) {
        replaced = true;
        return `${label} ${lensNum}`;
      }
      return b;
    });

    if (!replaced) {
      newBoxes.push(`${label} ${lensNum}`);
    }
    boxes[boxNum] = newBoxes;
  }

  total = 0;

  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
      const [label, score] = boxes[i][j].split(' ');
      total += (i + 1) * (j + 1) * parseInt(score, 10);
    }
  }
}

console.log(total);
