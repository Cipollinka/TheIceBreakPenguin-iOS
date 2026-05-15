import {
  PenguinSvg,
  PenguinBeanieSvg,
  PenguinAviatorSvg,
  PenguinKingSvg,
  PenguinNinjaSvg,
  PenguinPirateSvg,
  PenguinScientistSvg,
  PenguinWinterSvg,
} from '../assets/svg';

export const CHARACTERS = [
  {
    id: 'classic',
    name: 'Pip',
    title: 'Classic Penguin',
    cost: 0,
    svg: PenguinSvg,
    perk: 'The trusty original — always ready to chill.',
  },
  {
    id: 'beanie',
    name: 'Nico',
    title: 'Winter Cap',
    cost: 150,
    svg: PenguinBeanieSvg,
    perk: '+10% coins from Survival mode runs.',
  },
  {
    id: 'winter',
    name: 'Lumi',
    title: 'Frost Scout',
    cost: 200,
    svg: PenguinWinterSvg,
    perk: 'Start every match with one free Radar charge.',
  },
  {
    id: 'aviator',
    name: 'Maverick',
    title: 'Sky Captain',
    cost: 300,
    svg: PenguinAviatorSvg,
    perk: 'Survival blocks are slightly easier to crack.',
  },
  {
    id: 'scientist',
    name: 'Dr. Frost',
    title: 'Polar Researcher',
    cost: 450,
    svg: PenguinScientistSvg,
    perk: 'Hidden fish chance increases by +15%.',
  },
  {
    id: 'ninja',
    name: 'Shiro',
    title: 'Ice Ninja',
    cost: 600,
    svg: PenguinNinjaSvg,
    perk: 'Start every match with one extra Lightning.',
  },
  {
    id: 'pirate',
    name: 'Captain Blue',
    title: 'Sea Marauder',
    cost: 750,
    svg: PenguinPirateSvg,
    perk: '+1 bonus coin for every broken block.',
  },
  {
    id: 'king',
    name: 'Royal Frost',
    title: 'Penguin Monarch',
    cost: 1200,
    svg: PenguinKingSvg,
    perk: 'Start every match with full power-up loadout.',
  },
];

export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
}
