import {POWERUP, POWERUP_COST} from './constants';

export const POWERUPS = POWERUP;

export const POWERUP_META = {
  [POWERUP.LIGHTNING]: {
    id: POWERUP.LIGHTNING,
    name: 'Lightning',
    desc: 'Instantly shatter any chosen block (skips cracking stage).',
    cost: POWERUP_COST[POWERUP.LIGHTNING],
  },
  [POWERUP.FREEZE]: {
    id: POWERUP.FREEZE,
    name: 'Freeze',
    desc: 'Skip your turn — opponent must move next.',
    cost: POWERUP_COST[POWERUP.FREEZE],
  },
  [POWERUP.RADAR]: {
    id: POWERUP.RADAR,
    name: 'Radar',
    desc: 'Reveal a safe block to crack this turn.',
    cost: POWERUP_COST[POWERUP.RADAR],
  },
  [POWERUP.SHIELD]: {
    id: POWERUP.SHIELD,
    name: 'Shield',
    desc: 'Prevent the penguin from falling on your next tap.',
    cost: POWERUP_COST[POWERUP.SHIELD],
  },
};

export function defaultLoadout(characterId) {
  const base = {
    [POWERUP.LIGHTNING]: 1,
    [POWERUP.FREEZE]: 1,
    [POWERUP.RADAR]: 1,
    [POWERUP.SHIELD]: 0,
  };
  if (characterId === 'winter') base[POWERUP.RADAR] += 1;
  if (characterId === 'ninja') base[POWERUP.LIGHTNING] += 1;
  if (characterId === 'king') {
    base[POWERUP.LIGHTNING] += 1;
    base[POWERUP.FREEZE] += 1;
    base[POWERUP.RADAR] += 1;
    base[POWERUP.SHIELD] += 1;
  }
  return base;
}
