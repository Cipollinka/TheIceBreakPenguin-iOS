import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import Penguin from '../components/Penguin';
import {
  CupSvg,
  IconHomeSvg,
  IconReplaySvg,
  CoinSvg,
  FishSvg,
} from '../assets/svg';
import {usePlayer} from '../utils/PlayerContext';
import {COLORS} from '../theme/colors';
import {GAME_MODE, PLAYER} from '../utils/constants';

const ResultsScreen = ({result, onReplay, onMenu}) => {
  const {profile} = usePlayer();
  const {mode, winner, blocksBroken, fishCaught = 0, coinsEarned = 0} = result;
  const isSurvival = mode === GAME_MODE.SURVIVAL;
  const wonAgainstAi = mode === GAME_MODE.VS_AI && winner === PLAYER.ONE;
  const lostToAi = mode === GAME_MODE.VS_AI && winner === PLAYER.TWO;

  const title = isSurvival
    ? 'Round Over'
    : mode === GAME_MODE.VS_AI
    ? wonAgainstAi
      ? 'Victory!'
      : 'Defeat!'
    : winner === PLAYER.ONE
    ? 'Player 1 Wins!'
    : 'Player 2 Wins!';

  const sub = isSurvival
    ? `You broke ${blocksBroken} blocks`
    : mode === GAME_MODE.VS_AI
    ? wonAgainstAi
      ? 'The penguin trusts you again.'
      : 'The icy CPU outmaneuvered you.'
    : `${blocksBroken} blocks broken in this match`;

  const rank = isSurvival
    ? blocksBroken >= 18
      ? 'S'
      : blocksBroken >= 14
      ? 'A'
      : blocksBroken >= 10
      ? 'B'
      : blocksBroken >= 6
      ? 'C'
      : 'D'
    : wonAgainstAi
    ? 'WIN'
    : lostToAi
    ? 'LOSE'
    : 'OK';

  return (
    <ScreenBackground>
      <View style={styles.root}>
        <View style={styles.heroBox}>
          {isSurvival || lostToAi ? null : (
            <View style={styles.cupWrap}>
              <CupSvg width={120} height={120} />
            </View>
          )}
          <View style={styles.penguinWrap}>
            <Penguin
              size={180}
              characterId={profile.selectedCharacter}
              variant={isSurvival || lostToAi ? 'sad' : 'happy'}
              cheer={wonAgainstAi}
            />
          </View>
        </View>

        <GlassCard style={styles.card} padding={20}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>{sub}</Text>

          <View style={styles.stats}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{blocksBroken}</Text>
              <Text style={styles.statLabel}>Blocks</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{rank}</Text>
              <Text style={styles.statLabel}>Result</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <View style={styles.fishRow}>
                <FishSvg width={20} height={16} />
                <Text style={styles.fishVal}>×{fishCaught}</Text>
              </View>
              <Text style={styles.statLabel}>Fish</Text>
            </View>
          </View>

          <View style={styles.rewardCard}>
            <CoinSvg width={28} height={28} />
            <Text style={styles.rewardLabel}>Coins earned</Text>
            <Text style={styles.rewardValue}>+{coinsEarned}</Text>
          </View>
        </GlassCard>

        <View style={styles.actions}>
          <PrimaryButton
            title="PLAY AGAIN"
            onPress={onReplay}
            variant="warm"
            icon={<IconReplaySvg width={22} height={22} />}
          />
          <PrimaryButton
            title="MAIN MENU"
            onPress={onMenu}
            variant="primary"
            icon={<IconHomeSvg width={22} height={22} />}
          />
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  heroBox: {
    alignItems: 'center',
    height: 240,
    justifyContent: 'center',
  },
  cupWrap: {position: 'absolute', top: 0, zIndex: 2},
  penguinWrap: {marginTop: 20},
  card: {marginTop: 12, marginBottom: 18},
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  sub: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  stats: {flexDirection: 'row', marginTop: 18},
  statBox: {flex: 1, alignItems: 'center'},
  statVal: {
    color: COLORS.accent,
    fontSize: 26,
    fontWeight: '900',
  },
  fishRow: {flexDirection: 'row', alignItems: 'center'},
  fishVal: {
    color: COLORS.accent,
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 4,
  },
  statLabel: {color: COLORS.textSecondary, fontSize: 11, marginTop: 2},
  divider: {
    width: 1,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: 6,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 216, 107, 0.12)',
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: COLORS.accent,
  },
  rewardLabel: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    flex: 1,
    marginLeft: 10,
  },
  rewardValue: {
    color: COLORS.accent,
    fontWeight: '900',
    fontSize: 22,
  },
  actions: {},
});

export default ResultsScreen;
