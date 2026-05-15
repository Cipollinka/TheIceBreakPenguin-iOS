import {
  BLOCK_STATE,
  DIFFICULTY,
  PENGUIN_ROW,
  PENGUIN_COL,
} from './constants';
import {
  isPenguinTile,
  getNeighbors,
  countIntactNeighbors,
  tapBlock,
  evaluateEnd,
} from './gameLogic';

function distanceToPenguin(row, col) {
  return Math.abs(row - PENGUIN_ROW) + Math.abs(col - PENGUIN_COL);
}

function scoreMove(grid, block, difficulty) {
  if (isPenguinTile(block.row, block.col)) {
    return -10000;
  }

  const simulated = tapBlock(grid, block.row, block.col);
  const endState = evaluateEnd(simulated.grid);
  if (endState.ended) {
    return -9000;
  }

  const penguinNeighborsAfter = countIntactNeighbors(
    simulated.grid,
    PENGUIN_ROW,
    PENGUIN_COL,
  );

  let score = distanceToPenguin(block.row, block.col) * 8;

  if (block.state === BLOCK_STATE.CRACKED) {
    score += 6;
  }

  if (penguinNeighborsAfter === 1) {
    score -= 50;
  } else if (penguinNeighborsAfter === 2) {
    score -= 18;
  }

  const neighbors = getNeighbors(grid, block.row, block.col);
  const intactNeighbors = neighbors.filter(
    n => n.state === BLOCK_STATE.INTACT,
  ).length;
  score += intactNeighbors * 2;

  if (difficulty === DIFFICULTY.EASY) {
    score += (Math.random() - 0.5) * 80;
  } else if (difficulty === DIFFICULTY.NORMAL) {
    score += (Math.random() - 0.5) * 30;
  } else {
    score += (Math.random() - 0.5) * 6;
  }

  return score;
}

export function pickAiMove(grid, difficulty = DIFFICULTY.NORMAL) {
  const candidates = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const block = grid[r][c];
      if (block.state === BLOCK_STATE.BROKEN) continue;
      candidates.push(block);
    }
  }
  if (candidates.length === 0) return null;

  let best = candidates[0];
  let bestScore = scoreMove(grid, best, difficulty);
  for (let i = 1; i < candidates.length; i++) {
    const score = scoreMove(grid, candidates[i], difficulty);
    if (score > bestScore) {
      bestScore = score;
      best = candidates[i];
    }
  }
  return best;
}
