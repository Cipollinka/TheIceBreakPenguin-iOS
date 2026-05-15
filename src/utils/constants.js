export const GRID_SIZE = 5;
export const PENGUIN_ROW = 2;
export const PENGUIN_COL = 2;

export const BLOCK_STATE = {
  INTACT: 'intact',
  CRACKED: 'cracked',
  BROKEN: 'broken',
};

export const GAME_MODE = {
  VS_AI: 'vs_ai',
  TWO_PLAYER: 'two_player',
  SURVIVAL: 'survival',
};

export const DIFFICULTY = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
};

export const PLAYER = {
  ONE: 'one',
  TWO: 'two',
};

export const GAME_PHASE = {
  PLAYING: 'playing',
  ENDED: 'ended',
};

export const END_REASON = {
  PENGUIN_TILE_BROKEN: 'penguin_tile_broken',
  PENGUIN_ISOLATED: 'penguin_isolated',
  NO_MOVES: 'no_moves',
};

export const POWERUP = {
  LIGHTNING: 'lightning',
  FREEZE: 'freeze',
  RADAR: 'radar',
  SHIELD: 'shield',
};

export const POWERUP_COST = {
  [POWERUP.LIGHTNING]: 25,
  [POWERUP.FREEZE]: 20,
  [POWERUP.RADAR]: 15,
  [POWERUP.SHIELD]: 30,
};

export const FISH_CHANCE = 0.18;
export const FISH_REWARD = 4;
export const BLOCK_REWARD = 1;
export const WIN_REWARD = 35;
export const SURVIVAL_REWARD_PER_BLOCK = 2;
export const DAILY_REWARD = 60;
