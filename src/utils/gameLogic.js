import {
  GRID_SIZE,
  PENGUIN_ROW,
  PENGUIN_COL,
  BLOCK_STATE,
  END_REASON,
} from './constants';

const FISH_BASE_CHANCE = 0.22;

function rngFromSeed(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export function createGrid({seed = null, fishBoost = 0} = {}) {
  const rand = seed != null ? rngFromSeed(seed) : Math.random;
  const grid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      const isCenter = r === PENGUIN_ROW && c === PENGUIN_COL;
      row.push({
        row: r,
        col: c,
        state: BLOCK_STATE.INTACT,
        variant: ((r * 31 + c * 17) % 3) + 1,
        hasFish:
          !isCenter && rand() < FISH_BASE_CHANCE + fishBoost,
      });
    }
    grid.push(row);
  }
  return grid;
}

export function applyDailyTwist(grid, seed) {
  const rand = rngFromSeed(seed + 7);
  const twists = 3;
  const choices = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (r === PENGUIN_ROW && c === PENGUIN_COL) continue;
      const isNeighbor =
        Math.abs(r - PENGUIN_ROW) + Math.abs(c - PENGUIN_COL) === 1;
      if (isNeighbor) continue;
      choices.push([r, c]);
    }
  }
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  for (let i = 0; i < twists && i < choices.length; i++) {
    const [r, c] = choices[i];
    grid[r][c].state = BLOCK_STATE.CRACKED;
  }
  return grid;
}

export function isPenguinTile(row, col) {
  return row === PENGUIN_ROW && col === PENGUIN_COL;
}

export function getNeighbors(grid, row, col) {
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const result = [];
  for (const [dr, dc] of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
      result.push(grid[nr][nc]);
    }
  }
  return result;
}

export function countIntactNeighbors(grid, row, col) {
  return getNeighbors(grid, row, col).filter(
    n => n.state === BLOCK_STATE.INTACT,
  ).length;
}

export function isPenguinIsolated(grid) {
  return countIntactNeighbors(grid, PENGUIN_ROW, PENGUIN_COL) === 0;
}

export function isPenguinTileBroken(grid) {
  return grid[PENGUIN_ROW][PENGUIN_COL].state === BLOCK_STATE.BROKEN;
}

export function getRemainingTaps(grid) {
  let count = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].state !== BLOCK_STATE.BROKEN) {
        count++;
      }
    }
  }
  return count;
}

export function tapBlock(grid, row, col) {
  const newGrid = grid.map(r => r.map(b => ({...b})));
  const block = newGrid[row][col];
  let fishCaught = false;

  if (block.state === BLOCK_STATE.INTACT) {
    block.state = BLOCK_STATE.CRACKED;
    return {grid: newGrid, broke: false, fishCaught};
  }
  if (block.state === BLOCK_STATE.CRACKED) {
    block.state = BLOCK_STATE.BROKEN;
    if (block.hasFish) {
      fishCaught = true;
      block.hasFish = false;
    }
    return {grid: newGrid, broke: true, fishCaught};
  }
  return {grid: newGrid, broke: false, fishCaught};
}

export function shatterBlock(grid, row, col) {
  const newGrid = grid.map(r => r.map(b => ({...b})));
  const block = newGrid[row][col];
  let fishCaught = false;
  if (block.state !== BLOCK_STATE.BROKEN) {
    block.state = BLOCK_STATE.BROKEN;
    if (block.hasFish) {
      fishCaught = true;
      block.hasFish = false;
    }
  }
  return {grid: newGrid, fishCaught};
}

export function findSafeBlock(grid) {
  let bestCell = null;
  let bestScore = -1;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const b = grid[r][c];
      if (b.state !== BLOCK_STATE.INTACT) continue;
      if (isPenguinTile(r, c)) continue;
      const isNeighbor =
        Math.abs(r - PENGUIN_ROW) + Math.abs(c - PENGUIN_COL) === 1;
      const dist =
        Math.abs(r - PENGUIN_ROW) + Math.abs(c - PENGUIN_COL);
      let score = dist * 8;
      if (isNeighbor) {
        const intactNeigh = countIntactNeighbors(grid, PENGUIN_ROW, PENGUIN_COL);
        if (intactNeigh <= 2) score -= 100;
        else score -= 10;
      }
      if (b.hasFish) score += 5;
      if (score > bestScore) {
        bestScore = score;
        bestCell = b;
      }
    }
  }
  return bestCell;
}

export function evaluateEnd(grid) {
  if (isPenguinTileBroken(grid)) {
    return {ended: true, reason: END_REASON.PENGUIN_TILE_BROKEN};
  }
  if (isPenguinIsolated(grid)) {
    return {ended: true, reason: END_REASON.PENGUIN_ISOLATED};
  }
  const tappable = listTappableBlocks(grid);
  if (tappable.length === 0) {
    return {ended: true, reason: END_REASON.NO_MOVES};
  }
  return {ended: false};
}

export function listTappableBlocks(grid) {
  const list = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].state !== BLOCK_STATE.BROKEN) {
        list.push(grid[r][c]);
      }
    }
  }
  return list;
}

export function countBroken(grid) {
  let count = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].state === BLOCK_STATE.BROKEN) {
        count++;
      }
    }
  }
  return count;
}

export function getTodayKey(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDailySeed(now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return y * 10000 + m * 100 + d;
}
