import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {DEFAULT_PROFILE, loadProfile, saveProfile} from './storage';
import {evaluateAchievements, ACHIEVEMENTS} from './achievements';
import {getCharacter} from './characters';

const PlayerContext = createContext(null);

export const PlayerProvider = ({children}) => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);
  const [achievementToast, setAchievementToast] = useState(null);
  const queueRef = useRef([]);
  const processingRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    loadProfile().then(p => {
      if (mounted) {
        setProfile(p);
        setLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      saveProfile(profile);
    }
  }, [profile, loaded]);

  const runQueue = useCallback(() => {
    if (processingRef.current) return;
    if (queueRef.current.length === 0) {
      setAchievementToast(null);
      return;
    }
    processingRef.current = true;
    const next = queueRef.current.shift();
    setAchievementToast(next);
    setTimeout(() => {
      processingRef.current = false;
      runQueue();
    }, 2800);
  }, []);

  const queueToast = useCallback(
    toast => {
      queueRef.current.push(toast);
      runQueue();
    },
    [runQueue],
  );

  const checkAchievements = useCallback(
    nextProfile => {
      const unlocked = evaluateAchievements(nextProfile);
      if (unlocked.length === 0) return nextProfile;
      const updated = {...nextProfile, achievements: {...nextProfile.achievements}};
      let bonus = 0;
      for (const ach of unlocked) {
        updated.achievements[ach.id] = Date.now();
        bonus += ach.reward;
        queueToast({type: 'achievement', achievement: ach});
      }
      updated.coins = (updated.coins || 0) + bonus;
      return updated;
    },
    [queueToast],
  );

  const addCoins = useCallback(amount => {
    if (!amount) return;
    setProfile(prev => ({...prev, coins: Math.max(0, (prev.coins || 0) + amount)}));
  }, []);

  const spendCoins = useCallback(amount => {
    let success = false;
    setProfile(prev => {
      if ((prev.coins || 0) < amount) return prev;
      success = true;
      return {...prev, coins: prev.coins - amount};
    });
    return success;
  }, []);

  const unlockCharacter = useCallback(
    id => {
      const character = getCharacter(id);
      if (!character) return false;
      let did = false;
      setProfile(prev => {
        if (prev.unlockedCharacters.includes(id)) return prev;
        if ((prev.coins || 0) < character.cost) return prev;
        did = true;
        const next = {
          ...prev,
          coins: prev.coins - character.cost,
          unlockedCharacters: [...prev.unlockedCharacters, id],
        };
        return checkAchievements(next);
      });
      return did;
    },
    [checkAchievements],
  );

  const selectCharacter = useCallback(id => {
    setProfile(prev => {
      if (!prev.unlockedCharacters.includes(id)) return prev;
      return {...prev, selectedCharacter: id};
    });
  }, []);

  const updateSetting = useCallback((key, value) => {
    setProfile(prev => ({
      ...prev,
      settings: {...prev.settings, [key]: value},
    }));
  }, []);

  const completeGame = useCallback(
    ({
      mode,
      winner,
      blocksBroken,
      fishCaught = 0,
      coinsEarned = 0,
      survivalCount,
    }) => {
      setProfile(prev => {
        const next = {
          ...prev,
          totalGames: prev.totalGames + 1,
          totalBlocksBroken: prev.totalBlocksBroken + blocksBroken,
          fishCaught: prev.fishCaught + fishCaught,
          coins: prev.coins + coinsEarned,
        };
        if (mode === 'vs_ai' && winner === 'one') {
          next.winsVsAi = (next.winsVsAi || 0) + 1;
        }
        if (mode === 'survival' && typeof survivalCount === 'number') {
          next.bestSurvival = Math.max(next.bestSurvival, survivalCount);
        }
        return checkAchievements(next);
      });
    },
    [checkAchievements],
  );

  const completeDailyChallenge = useCallback(
    ({success, reward, today}) => {
      setProfile(prev => {
        const prevDaily = prev.dailyChallenge || {};
        const wasYesterday =
          prevDaily.lastCompletedDate &&
          isYesterday(prevDaily.lastCompletedDate, today);
        const next = {
          ...prev,
          dailyChallenge: {
            ...prevDaily,
            lastSeenDate: today,
            lastCompletedDate: success ? today : prevDaily.lastCompletedDate,
            streak: success ? (wasYesterday ? (prevDaily.streak || 0) + 1 : 1) : prevDaily.streak || 0,
          },
        };
        if (success) {
          next.coins = (next.coins || 0) + reward;
        }
        return checkAchievements(next);
      });
    },
    [checkAchievements],
  );

  const resetProfile = useCallback(() => {
    setProfile({...DEFAULT_PROFILE});
  }, []);

  const dismissToast = useCallback(() => {
    queueRef.current = [];
    processingRef.current = false;
    setAchievementToast(null);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      loaded,
      addCoins,
      spendCoins,
      unlockCharacter,
      selectCharacter,
      updateSetting,
      completeGame,
      completeDailyChallenge,
      resetProfile,
      achievementToast,
      dismissToast,
      achievementsList: ACHIEVEMENTS,
    }),
    [
      profile,
      loaded,
      addCoins,
      spendCoins,
      unlockCharacter,
      selectCharacter,
      updateSetting,
      completeGame,
      completeDailyChallenge,
      resetProfile,
      achievementToast,
      dismissToast,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => useContext(PlayerContext);

function isYesterday(a, b) {
  if (!a || !b) return false;
  const dA = new Date(a);
  const dB = new Date(b);
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.abs(dB - dA - oneDay) < oneDay * 0.6;
}
