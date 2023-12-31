import fs from 'fs';

function walkFrom(row, col, direction) {
  tableNorth.fill(0);
  tableSouth.fill(0);
  tableWest.fill(0);
  tableEast.fill(0);

  const table = getTable(direction);

  const position = row * width + col;

  table[position] = 1;

  beams = [createBeam(row, col, direction)];

  while (beams.length > 0) {
    walk(beams[0]);
  }

  return sumTables();
}

function createBeam(row, col, direction) {
  return { row: row, col: col, direction: direction };
}

function walk(beam) {
  updateBeamDirection(beam);

  if (beam.direction == NORTH) {
    beam.row -= 1;
  }
  if (beam.direction == SOUTH) {
    beam.row += 1;
  }
  if (beam.direction == EAST) {
    beam.col += 1;
  }
  if (beam.direction == WEST) {
    beam.col -= 1;
  }

  if (beam.row < 0) {
    beams.shift();
    return;
  }
  if (beam.col < 0) {
    beams.shift();
    return;
  }

  if (beam.row > height - 1) {
    beams.shift();
    return;
  }
  if (beam.col > width - 1) {
    beams.shift();
    return;
  }

  const table = getTable(beam.direction);

  const position = beam.row * width + beam.col;

  if (table[position] != 0) {
    beams.shift();
    return;
  }

  table[position] = 1;
}

function updateBeamDirection(beam) {
  const symbol = map[beam.row][beam.col];

  if (symbol == '.') {
    return;
  }

  if (symbol == '\\') {
    if (beam.direction == NORTH) {
      beam.direction = WEST;
      return;
    }
    if (beam.direction == SOUTH) {
      beam.direction = EAST;
      return;
    }
    if (beam.direction == EAST) {
      beam.direction = SOUTH;
      return;
    }
    if (beam.direction == WEST) {
      beam.direction = NORTH;
      return;
    }
  }

  if (symbol == '/') {
    if (beam.direction == NORTH) {
      beam.direction = EAST;
      return;
    }
    if (beam.direction == SOUTH) {
      beam.direction = WEST;
      return;
    }
    if (beam.direction == EAST) {
      beam.direction = NORTH;
      return;
    }
    if (beam.direction == WEST) {
      beam.direction = SOUTH;
      return;
    }
  }

  if (symbol == '-') {
    if (beam.direction == EAST) {
      return;
    }
    if (beam.direction == WEST) {
      return;
    }

    beam.direction = EAST;

    beams.push(createBeam(beam.row, beam.col, WEST));
  }

  if (symbol == '|') {
    if (beam.direction == NORTH) {
      return;
    }
    if (beam.direction == SOUTH) {
      return;
    }

    beam.direction = NORTH;

    beams.push(createBeam(beam.row, beam.col, SOUTH));
  }
}

function getTable(direction) {
  if (direction == NORTH) {
    return tableNorth;
  }
  if (direction == SOUTH) {
    return tableSouth;
  }
  if (direction == WEST) {
    return tableWest;
  }
  if (direction == EAST) {
    return tableEast;
  }
}

function sumTables() {
  let sum = 0;

  const off = width * height;

  for (let n = 0; n < off; n++) {
    if (tableNorth[n] == 1) {
      sum += 1;
      continue;
    }
    if (tableSouth[n] == 1) {
      sum += 1;
      continue;
    }
    if (tableWest[n] == 1) {
      sum += 1;
      continue;
    }
    if (tableEast[n] == 1) {
      sum += 1;
      continue;
    }
  }
  return sum;
}

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

const map = [];

let width = 0;

let height = 0;

let tableNorth = [];
let tableSouth = [];
let tableWest = [];
let tableEast = [];

let beams = [];

const input = fs.readFileSync('input.txt', 'utf-8');

const lines = input.split('\n');

for (const line of lines) {
  map.push(line.trim());
}

height = map.length;

width = map[0].length;

tableNorth = new Uint8Array(width * height);
tableSouth = new Uint8Array(width * height);
tableWest = new Uint8Array(width * height);
tableEast = new Uint8Array(width * height);

let best = 0;

for (let row = 0; row < height; row++) {
  const fromWest = walkFrom(row, 0, EAST);

  if (fromWest > best) {
    best = fromWest;
  }

  const fromEast = walkFrom(row, width - 1, WEST);

  if (fromEast > best) {
    best = fromEast;
  }
}

for (let col = 0; col < width; col++) {
  const fromNorth = walkFrom(0, col, SOUTH);

  if (fromNorth > best) {
    best = fromNorth;
  }

  const fromSouth = walkFrom(height - 1, col, NORTH);

  if (fromSouth > best) {
    best = fromSouth;
  }
}

console.log(best);
