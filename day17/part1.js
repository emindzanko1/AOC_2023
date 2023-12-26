import fs from 'fs';
import { Heap } from 'heap-js';

const input = fs.readFileSync('input.txt', 'utf-8');
const lines = input.split('\r\n');

const width = lines[0].length;
const height = lines.length;

const DIRS = { Left: [-1, 0], Right: [1, 0], Up: [0, -1], Down: [0, 1] };
const OPPOSITE_DIRS = { Left: 'Right', Right: 'Left', Up: 'Down', Down: 'Up' };

const visited = new Set();
const customPriorityComparator = (a, b) => a.heatLoss - b.heatLoss;
const heap = new Heap(customPriorityComparator);

heap.push({ x: 1, y: 0, heatLoss: +lines[0][1], straightSteps: 1, dir: 'Right' });
heap.push({ x: 0, y: 1, heatLoss: +lines[1][0], straightSteps: 1, dir: 'Down' });

while (heap.length > 0) {
  const step = heap.pop();

  if (step.x === width - 1 && step.y === height - 1) {
    console.log(step.heatLoss);
    break;
  }

  if (!visited.has(`${step.x},${step.y},${step.dir},${step.straightSteps}`)) {
    visited.add(`${step.x},${step.y},${step.dir},${step.straightSteps}`);

    for (const dir of Object.keys(DIRS)) {
      if ((step.dir === dir && step.straightSteps === 3) || dir === OPPOSITE_DIRS[step.dir]) {
        continue;
      }

      const newStep = { x: step.x + DIRS[dir][0], y: step.y + DIRS[dir][1] };

      if (newStep.x >= 0 && newStep.x < width && newStep.y >= 0 && newStep.y < height) {
        const straightSteps = step.dir === dir ? step.straightSteps + 1 : 1;
        const heatLoss = step.heatLoss + +lines[newStep.y][newStep.x];
        heap.push({ ...newStep, heatLoss, straightSteps, dir });
      }
    }
  }
}
