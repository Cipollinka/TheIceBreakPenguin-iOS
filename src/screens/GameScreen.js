import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import IceGrid from '../components/IceGrid';
import IconButton from '../components/IconButton';
import GlassCard from '../components/GlassCard';
import PlayerBadge from '../components/PlayerBadge';
import PowerupBar from '../components/PowerupBar';
import CoinBadge from '../components/CoinBadge';
import FishPopup from '../components/FishPopup';
import {
  IconBackSvg,
  IconReplaySvg,
  HammerSvg,
  FishSvg,
} from '../assets/svg';
import {
  createGrid,
  applyDailyTwist,
  tapBlock,
  shatterBlock,
  findSafeBlock,
  evaluateEnd,
  countBroken,
  isPenguinTile,
  getDailySeed,
  getTodayKey,
} from '../utils/gameLogic';
import {pickAiMove} from '../utils/aiOpponent';
import {
  GAME_MODE,
  PLAYER,
  BLOCK_STATE,
  END_REASON,
  POWERUP,
  FISH_REWARD,
  BLOCK_REWARD,
  WIN_REWARD,
  SURVIVAL_REWARD_PER_BLOCK,
  DAILY_REWARD,
} from '../utils/constants';
import {defaultLoadout} from '../utils/powerups';
import {usePlayer} from '../utils/PlayerContext';
import {COLORS} from '../theme/colors';

const PLAYER_COLORS = {
  [PLAYER.ONE]: {from: '#FFD86B', to: '#E07A1E'},
  [PLAYER.TWO]: {from: '#88B8FF', to: '#1F4E9C'},
};

let popupCounter = 0;

const GameScreen = ({
  mode,
  difficulty,
  isDaily = false,
  onExit,
  onEnd,
}) => {
  const {profile, completeGame, completeDailyChallenge} = usePlayer();
  const sound = profile.settings.sound;
  const vibration = profile.settings.vibration;
  const characterId = profile.selectedCharacter;
  const isPirate = characterId === 'pirate';
  const isAvi = characterId === 'aviator';
  const isScientist = characterId === 'scientist';
  const isBeanie = characterId === 'beanie';
  const isSurvival = mode === GAME_MODE.SURVIVAL;

  const seed = isDaily ? getDailySeed() : null;
  const fishBoost = isScientist ? 0.15 : 0;

  const [grid, setGrid] = useState(() => {
    const g = createGrid({seed, fishBoost});
    return isDaily ? applyDailyTwist(g, seed) : g;
  });
  const [current, setCurrent] = useState(PLAYER.ONE);
  const [phase, setPhase] = useState('playing');
  const [endInfo, setEndInfo] = useState(null);
  const [thinking, setThinking] = useState(false);

  const [loadout, setLoadout] = useState(() => defaultLoadout(characterId));
  const [activePowerup, setActivePowerup] = useState(null);
  const [highlightedBlock, setHighlightedBlock] = useState(null);
  const [shieldActive, setShieldActive] = useState(false);
  const [frozenBlock, setFrozenBlock] = useState(null);

  const [coinsEarned, setCoinsEarned] = useState(0);
  const [fishCaughtCount, setFishCaughtCount] = useState(0);
  const [popups, setPopups] = useState([]);

  const handleEnded = useRef(false);
  const banner = useRef(new Animated.Value(0)).current;
  const coinFlash = useRef(new Animated.Value(0)).current;

  const broken = countBroken(grid);

  useEffect(() => {
    banner.setValue(0);
    Animated.timing(banner, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [current, banner]);

  const triggerVibration = (ms = 30) => {
    if (vibration) Vibration.vibrate(ms);
  };

  const flashCoin = () => {
    coinFlash.setValue(0);
    Animated.sequence([
      Animated.timing(coinFlash, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(coinFlash, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const addPopup = (x, y) => {
    const id = ++popupCounter;
    setPopups(prev => [...prev, {id, x, y}]);
  };
  const removePopup = id => setPopups(prev => prev.filter(p => p.id !== id));

  const finish = (winner, reason, finalGrid) => {
    if (handleEnded.current) return;
    handleEnded.current = true;
    triggerVibration(120);
    const finalBroken = countBroken(finalGrid || grid);
    let extra = 0;
    if (!isSurvival && winner === PLAYER.ONE && mode === GAME_MODE.VS_AI) {
      extra += WIN_REWARD;
    }
    if (isSurvival) {
      extra += finalBroken * SURVIVAL_REWARD_PER_BLOCK * (isBeanie ? 1.1 : 1);
      extra = Math.floor(extra);
    }
    if (isDaily && winner !== 'lose' && reason !== END_REASON.PENGUIN_TILE_BROKEN) {
      extra += DAILY_REWARD;
    }
    const totalCoins = coinsEarned + extra;
    setCoinsEarned(totalCoins);
    setEndInfo({winner, reason});
    setPhase('ended');

    completeGame({
      mode,
      winner,
      blocksBroken: finalBroken,
      fishCaught: fishCaughtCount,
      coinsEarned: totalCoins,
      survivalCount: isSurvival ? finalBroken : undefined,
    });

    if (isDaily) {
      const success =
        winner !== 'lose' &&
        reason !== END_REASON.PENGUIN_TILE_BROKEN &&
        reason !== END_REASON.PENGUIN_ISOLATED;
      completeDailyChallenge({
        success,
        reward: success ? DAILY_REWARD : 0,
        today: getTodayKey(),
      });
    }

    setTimeout(() => {
      onEnd({
        mode,
        winner,
        reason,
        blocksBroken: finalBroken,
        fishCaught: fishCaughtCount,
        coinsEarned: totalCoins,
        isDaily,
      });
    }, 1800);
  };

  const handleFish = block => {
    setCoinsEarned(c => c + FISH_REWARD);
    setFishCaughtCount(n => n + 1);
    flashCoin();
    triggerVibration(40);
    addPopup(block.row, block.col);
  };

  const performTap = (row, col, byPlayer) => {
    if (phase !== 'playing' || handleEnded.current) return;
    const block = grid[row][col];
    if (block.state === BLOCK_STATE.BROKEN) return;

    if (frozenBlock && frozenBlock.row === row && frozenBlock.col === col) {
      return;
    }

    const result = tapBlock(grid, row, col);
    setGrid(result.grid);
    triggerVibration(result.broke ? 60 : 20);

    if (result.broke) {
      const bonus = BLOCK_REWARD + (isPirate ? 1 : 0);
      setCoinsEarned(c => c + bonus);
    }
    if (result.fishCaught) {
      handleFish(block);
    }

    if (highlightedBlock) setHighlightedBlock(null);
    if (frozenBlock && frozenBlock.row !== row && frozenBlock.col !== col) {
      // keep frozen block until opponent's turn finishes
    }

    if (isPenguinTile(row, col) && result.broke) {
      if (shieldActive) {
        setShieldActive(false);
        return;
      }
      if (isSurvival) {
        finish('lose', END_REASON.PENGUIN_TILE_BROKEN, result.grid);
      } else {
        const winner = byPlayer === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE;
        finish(winner, END_REASON.PENGUIN_TILE_BROKEN, result.grid);
      }
      return;
    }

    const end = evaluateEnd(result.grid);
    if (end.ended) {
      if (shieldActive && end.reason !== END_REASON.NO_MOVES) {
        setShieldActive(false);
      } else {
        if (isSurvival) {
          finish('lose', end.reason, result.grid);
        } else {
          const winner = byPlayer === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE;
          finish(winner, end.reason, result.grid);
        }
        return;
      }
    }

    if (result.broke && !isSurvival) {
      setCurrent(byPlayer === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE);
      setFrozenBlock(null);
    }
  };

  const activatePowerup = id => {
    if (phase !== 'playing') return;
    if ((loadout[id] || 0) <= 0) return;
    if (mode === GAME_MODE.VS_AI && current === PLAYER.TWO) return;

    if (id === POWERUP.FREEZE) {
      consumePowerup(id);
      setCurrent(c => (c === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE));
      triggerVibration(40);
      return;
    }
    if (id === POWERUP.SHIELD) {
      consumePowerup(id);
      setShieldActive(true);
      triggerVibration(40);
      return;
    }
    if (id === POWERUP.RADAR) {
      consumePowerup(id);
      const safe = findSafeBlock(grid);
      if (safe) setHighlightedBlock({row: safe.row, col: safe.col});
      triggerVibration(30);
      return;
    }
    setActivePowerup(prev => (prev === id ? null : id));
  };

  const consumePowerup = id => {
    setLoadout(prev => ({...prev, [id]: Math.max(0, (prev[id] || 0) - 1)}));
  };

  const handleBlockTap = (row, col) => {
    if (phase !== 'playing') return;
    if (mode === GAME_MODE.VS_AI && current === PLAYER.TWO) return;

    if (activePowerup === POWERUP.LIGHTNING) {
      const block = grid[row][col];
      if (block.state === BLOCK_STATE.BROKEN) return;
      consumePowerup(POWERUP.LIGHTNING);
      setActivePowerup(null);
      const result = shatterBlock(grid, row, col);
      setGrid(result.grid);
      triggerVibration(80);
      if (result.fishCaught) handleFish(block);
      setCoinsEarned(c => c + BLOCK_REWARD + (isPirate ? 1 : 0));

      if (isPenguinTile(row, col)) {
        if (shieldActive) {
          setShieldActive(false);
          return;
        }
        if (isSurvival) {
          finish('lose', END_REASON.PENGUIN_TILE_BROKEN, result.grid);
        } else {
          finish(
            current === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE,
            END_REASON.PENGUIN_TILE_BROKEN,
            result.grid,
          );
        }
        return;
      }
      const end = evaluateEnd(result.grid);
      if (end.ended) {
        if (shieldActive) {
          setShieldActive(false);
        } else {
          if (isSurvival) finish('lose', end.reason, result.grid);
          else
            finish(
              current === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE,
              end.reason,
              result.grid,
            );
          return;
        }
      }
      if (!isSurvival) {
        setCurrent(current === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE);
        setFrozenBlock(null);
      }
      return;
    }

    performTap(row, col, current);
  };

  useEffect(() => {
    if (mode !== GAME_MODE.VS_AI) return;
    if (current !== PLAYER.TWO || phase !== 'playing') return;

    setThinking(true);
    const timeout = setTimeout(() => {
      let move = pickAiMove(grid, difficulty);
      if (move && frozenBlock && move.row === frozenBlock.row && move.col === frozenBlock.col) {
        const alt = pickAiMove(
          grid.map(row =>
            row.map(b =>
              b.row === frozenBlock.row && b.col === frozenBlock.col
                ? {...b, state: BLOCK_STATE.BROKEN}
                : b,
            ),
          ),
          difficulty,
        );
        if (alt) move = alt;
      }
      if (move) performTap(move.row, move.col, PLAYER.TWO);
      setThinking(false);
    }, 850);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, grid, phase, mode, difficulty]);

  const resetGame = () => {
    handleEnded.current = false;
    const g = createGrid({seed, fishBoost});
    setGrid(isDaily ? applyDailyTwist(g, seed) : g);
    setCurrent(PLAYER.ONE);
    setPhase('playing');
    setEndInfo(null);
    setLoadout(defaultLoadout(characterId));
    setActivePowerup(null);
    setHighlightedBlock(null);
    setFrozenBlock(null);
    setShieldActive(false);
    setCoinsEarned(0);
    setFishCaughtCount(0);
    setPopups([]);
  };

  const showVictoryPenguin =
    !isSurvival && endInfo && endInfo.winner === PLAYER.ONE && mode === GAME_MODE.VS_AI;

  const playerOneLabel =
    mode === GAME_MODE.VS_AI
      ? 'YOU'
      : mode === GAME_MODE.TWO_PLAYER
      ? 'PLAYER 1'
      : 'YOU';
  const playerTwoLabel = mode === GAME_MODE.VS_AI ? 'CPU' : 'PLAYER 2';

  const bannerOpacity = banner.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });
  const bannerScale = banner.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });
  const coinScale = coinFlash.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <ScreenBackground>
      <View style={styles.topRow}>
        <IconButton onPress={onExit}>
          <IconBackSvg width={22} height={22} />
        </IconButton>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>
            {isDaily ? 'Daily Challenge' : "Don't Break the Ice"}
          </Text>
          <Text style={styles.subtitle}>
            {isSurvival
              ? `Blocks broken: ${broken}`
              : current === PLAYER.ONE
              ? `${playerOneLabel}'s turn`
              : `${playerTwoLabel}'s turn`}
          </Text>
        </View>
        <IconButton onPress={resetGame}>
          <IconReplaySvg width={22} height={22} />
        </IconButton>
      </View>

      <View style={styles.statsRow}>
        <Animated.View style={{transform: [{scale: coinScale}]}}>
          <CoinBadge coins={profile.coins + coinsEarned} />
        </Animated.View>
        <View style={styles.fishStat}>
          <FishSvg width={22} height={18} />
          <Text style={styles.fishCount}>×{fishCaughtCount}</Text>
        </View>
      </View>

      {!isSurvival ? (
        <View style={styles.playerRow}>
          <PlayerBadge
            label={playerOneLabel}
            sub="Tap once per turn"
            color={PLAYER_COLORS[PLAYER.ONE]}
            active={current === PLAYER.ONE}
          />
          <PlayerBadge
            label={playerTwoLabel}
            sub={
              mode === GAME_MODE.VS_AI && thinking ? 'Thinking…' : 'Stay icy'
            }
            color={PLAYER_COLORS[PLAYER.TWO]}
            active={current === PLAYER.TWO}
          />
        </View>
      ) : (
        <GlassCard style={styles.survivalCard} padding={14}>
          <View style={styles.survivalRow}>
            <HammerSvg width={42} height={42} />
            <View style={styles.survivalText}>
              <Text style={styles.survivalLabel}>SURVIVAL</Text>
              <Text style={styles.survivalSub}>
                Break blocks without dropping the penguin
              </Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreVal}>{broken}</Text>
              <Text style={styles.scoreLabel}>broken</Text>
            </View>
          </View>
        </GlassCard>
      )}

      <View style={styles.gridWrap}>
        <IceGrid
          grid={grid}
          onTap={handleBlockTap}
          characterId={characterId}
          highlightedBlock={highlightedBlock}
          frozenBlock={frozenBlock}
          shieldActive={shieldActive}
          disabled={
            phase !== 'playing' ||
            (mode === GAME_MODE.VS_AI && current === PLAYER.TWO)
          }
          fallen={
            phase === 'ended' &&
            (isSurvival ||
              endInfo?.reason === END_REASON.PENGUIN_TILE_BROKEN ||
              endInfo?.reason === END_REASON.PENGUIN_ISOLATED)
          }
          victory={showVictoryPenguin}
        />
        {popups.map(p => (
          <FishPopup
            key={p.id}
            x={p.x * 60 + 60}
            y={p.y * 60 + 60}
            onDone={() => removePopup(p.id)}
          />
        ))}
      </View>

      <PowerupBar
        loadout={loadout}
        activePowerup={activePowerup}
        onSelect={activatePowerup}
        disabled={
          phase !== 'playing' ||
          (mode === GAME_MODE.VS_AI && current === PLAYER.TWO)
        }
      />

      <View style={styles.bannerWrap}>
        <Animated.View
          style={{opacity: bannerOpacity, transform: [{scale: bannerScale}]}}>
          <GlassCard style={styles.bannerCard} padding={12} radius={14}>
            <Text style={styles.bannerText}>
              {phase === 'ended'
                ? isSurvival
                  ? `Game over — ${broken} blocks broken!`
                  : endInfo?.winner === PLAYER.ONE
                  ? `${playerOneLabel} wins!`
                  : `${playerTwoLabel} wins!`
                : activePowerup === POWERUP.LIGHTNING
                ? 'Tap any block to shatter it instantly'
                : highlightedBlock
                ? 'Radar suggests the green block'
                : shieldActive
                ? 'Shield ready — your next slip is blocked'
                : isSurvival
                ? 'Tap a block twice to crack it open'
                : current === PLAYER.ONE
                ? `${playerOneLabel}: pick a block to tap`
                : mode === GAME_MODE.VS_AI
                ? 'CPU is thinking…'
                : `${playerTwoLabel}: pick a block to tap`}
            </Text>
          </GlassCard>
        </Animated.View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 4,
  },
  titleWrap: {flex: 1, alignItems: 'center'},
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 6,
  },
  fishStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 212, 255, 0.45)',
  },
  fishCount: {
    color: COLORS.textPrimary,
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 14,
  },
  playerRow: {
    flexDirection: 'row',
    marginTop: 14,
    paddingHorizontal: 18,
  },
  survivalCard: {marginTop: 14, marginHorizontal: 24},
  survivalRow: {flexDirection: 'row', alignItems: 'center'},
  survivalText: {flex: 1, marginLeft: 12},
  survivalLabel: {
    color: COLORS.accent,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  survivalSub: {color: COLORS.textSecondary, fontSize: 12, marginTop: 2},
  scoreBox: {alignItems: 'center'},
  scoreVal: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '900',
  },
  scoreLabel: {color: COLORS.textSecondary, fontSize: 11},
  gridWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  bannerWrap: {
    paddingHorizontal: 24,
    paddingTop: 6,
    paddingBottom: 24,
  },
  bannerCard: {alignItems: 'center'},
  bannerText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default GameScreen;
