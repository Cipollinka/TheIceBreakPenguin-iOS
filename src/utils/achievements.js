export const ACHIEVEMENTS = [
  {
    id: 'first_steps',
    name: 'First Steps',
    desc: 'Play your first match.',
    reward: 20,
    test: stats => stats.totalGames >= 1,
  },
  {
    id: 'rookie_breaker',
    name: 'Rookie Breaker',
    desc: 'Break 50 ice blocks across all games.',
    reward: 30,
    test: stats => stats.totalBlocksBroken >= 50,
  },
  {
    id: 'ice_master',
    name: 'Ice Master',
    desc: 'Break 250 ice blocks total.',
    reward: 80,
    test: stats => stats.totalBlocksBroken >= 250,
  },
  {
    id: 'ai_slayer',
    name: 'CPU Slayer',
    desc: 'Win 3 matches against the CPU.',
    reward: 40,
    test: stats => stats.winsVsAi >= 3,
  },
  {
    id: 'cold_blooded',
    name: 'Cold Blooded',
    desc: 'Win 10 matches against the CPU.',
    reward: 120,
    test: stats => stats.winsVsAi >= 10,
  },
  {
    id: 'survivor',
    name: 'Survivor',
    desc: 'Reach 12 broken blocks in Survival mode.',
    reward: 60,
    test: stats => stats.bestSurvival >= 12,
  },
  {
    id: 'iron_penguin',
    name: 'Iron Penguin',
    desc: 'Reach 18 broken blocks in Survival mode.',
    reward: 150,
    test: stats => stats.bestSurvival >= 18,
  },
  {
    id: 'fisher_friend',
    name: 'Fisher Friend',
    desc: 'Catch 10 hidden fish under the ice.',
    reward: 50,
    test: stats => stats.fishCaught >= 10,
  },
  {
    id: 'reel_master',
    name: 'Reel Master',
    desc: 'Catch 50 hidden fish.',
    reward: 150,
    test: stats => stats.fishCaught >= 50,
  },
  {
    id: 'daily_devotee',
    name: 'Daily Devotee',
    desc: 'Reach a 5-day daily challenge streak.',
    reward: 100,
    test: stats => (stats.dailyChallenge?.streak || 0) >= 5,
  },
  {
    id: 'collector',
    name: 'Collector',
    desc: 'Unlock 3 different penguin characters.',
    reward: 80,
    test: stats => (stats.unlockedCharacters?.length || 0) >= 3,
  },
  {
    id: 'royalty',
    name: 'Royalty',
    desc: 'Unlock the Royal Frost penguin.',
    reward: 200,
    test: stats => (stats.unlockedCharacters || []).includes('king'),
  },
];

export function evaluateAchievements(profile) {
  const unlocked = [];
  const current = profile.achievements || {};
  for (const ach of ACHIEVEMENTS) {
    if (current[ach.id]) continue;
    if (ach.test(profile)) {
      unlocked.push(ach);
    }
  }
  return unlocked;
}
