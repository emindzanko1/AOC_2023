import fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');

const workflows = {};
const parts = [];

const lines = input.trim().split('\n');

lines.forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine !== '') {
    const [name, propertiesStr] = trimmedLine.replace('}', '').split('{');
    const properties = propertiesStr.split(',');

    if (name) {
      workflows[name] = [];

      properties.forEach(item => {
        if (item.includes(':')) {
          const [condition, nextWorkflow] = item.split(':');
          workflows[name].push([condition[0], condition[1], parseInt(condition.substring(2)), nextWorkflow]);
        } else {
          workflows[name].push(item);
        }
      });
    } else {
      parts.push({});
      properties.forEach(item => {
        const [key, value] = item.split('=');
        parts[parts.length - 1][key] = parseInt(value);
      });
    }
  }
});

let answer = 0;
parts.forEach(part => {
  let curWorkflow = 'in';

  while (curWorkflow !== 'A' && curWorkflow !== 'R') {
    for (let step of workflows[curWorkflow]) {
      if (typeof step === 'string') {
        curWorkflow = step;
        break;
      }

      const [key, condition, value, nextWorkflow] = step;

      if ((condition === '<' && part[key] < value) || (condition === '>' && part[key] > value)) {
        curWorkflow = nextWorkflow;
        break;
      }
    }
  }

  if (curWorkflow === 'A') {
    answer += Object.values(part).reduce((acc, val) => acc + val, 0);
  }
});

console.log(answer);
