import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@IcePenguinStay::profile_v1';

export const DEFAULT_PROFILE = {
  coins: 80,
  bestSurvival: 0,
  winsVsAi: 0,
  totalGames: 0,
  totalBlocksBroken: 0,
  fishCaught: 0,
  selectedCharacter: 'classic',
  unlockedCharacters: ['classic'],
  achievements: {},
  dailyChallenge: {
    lastCompletedDate: null,
    streak: 0,
    lastSeenDate: null,
  },
  settings: {
    sound: true,
    vibration: true,
  },
};

export async function loadProfile() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {...DEFAULT_PROFILE};
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      dailyChallenge: {
        ...DEFAULT_PROFILE.dailyChallenge,
        ...(parsed.dailyChallenge || {}),
      },
      settings: {...DEFAULT_PROFILE.settings, ...(parsed.settings || {})},
      achievements: parsed.achievements || {},
      unlockedCharacters:
        parsed.unlockedCharacters || DEFAULT_PROFILE.unlockedCharacters,
    };
  } catch {
    return {...DEFAULT_PROFILE};
  }
}

export async function saveProfile(profile) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(profile));
  } catch {}
}

export async function clearProfile() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {}
}
