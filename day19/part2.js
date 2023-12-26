import fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');

function solve(input) {
  let [workflows] = input.split('\n\n');

  const map = {};
  for (const line of workflows.split('\n')) {
    let [name, rules] = line.split(/[{}]/g);
    map[name] = ranges => {
      function getCombos(target, ranges) {
        return target === 'A'
          ? Object.values(ranges)
              .map(([min, max]) => max - min + 1)
              .reduce((acc, n) => acc * n)
          : target !== 'R'
          ? map[target](ranges)
          : 0;
      }

      let sum = 0;
      for (const rule of rules.split(',')) {
        if (rule.includes(':')) {
          let [expr, target] = rule.split(':');
          let op = expr.match(/[\W]/g)[0];
          let [part, val] = expr.split(op);
          val = +val;
          const yesRanges = structuredClone(ranges);
          if (op === '>') {
            yesRanges[part][0] = Math.max(yesRanges[part][0], val + 1);
            ranges[part][1] = Math.min(ranges[part][1], val);
          } else {
            yesRanges[part][1] = Math.min(yesRanges[part][1], val - 1);
            ranges[part][0] = Math.max(ranges[part][0], val);
          }
          sum += getCombos(target, yesRanges);
        } else {
          sum += getCombos(rule, ranges);
        }
      }
      return sum;
    };
  }

  const ranges = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  };
  console.log(map.in(ranges));
}

solve(input);
