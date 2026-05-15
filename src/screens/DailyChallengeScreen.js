import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import IconButton from '../components/IconButton';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import CoinBadge from '../components/CoinBadge';
import Penguin from '../components/Penguin';
import {
  IconBackSvg,
  IconCalendarSvg,
  CoinSvg,
  IconPlaySvg,
} from '../assets/svg';
import {usePlayer} from '../utils/PlayerContext';
import {getTodayKey} from '../utils/gameLogic';
import {DAILY_REWARD} from '../utils/constants';
import {COLORS} from '../theme/colors';

const formatDate = key => {
  if (!key) return '—';
  const d = new Date(key);
  if (isNaN(d)) return key;
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const DailyChallengeScreen = ({onBack, onStart}) => {
  const {profile} = usePlayer();
  const today = getTodayKey();
  const daily = profile.dailyChallenge || {};
  const alreadyDone = daily.lastCompletedDate === today;

  return (
    <ScreenBackground>
      <View style={styles.topRow}>
        <IconButton onPress={onBack}>
          <IconBackSvg width={22} height={22} />
        </IconButton>
        <Text style={styles.title}>Daily Challenge</Text>
        <CoinBadge coins={profile.coins} />
      </View>

      <View style={styles.body}>
        <GlassCard style={styles.card} padding={22}>
          <View style={styles.calendar}>
            <IconCalendarSvg width={70} height={70} />
          </View>
          <Text style={styles.today}>{formatDate(today)}</Text>
          <Text style={styles.headline}>
            {alreadyDone ? "Today's challenge complete!" : 'Daily puzzle awaits'}
          </Text>
          <Text style={styles.sub}>
            A new ice grid every day with hand-cracked starter blocks.
            Survive without dropping the penguin to claim the reward.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{daily.streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>+{DAILY_REWARD}</Text>
              <Text style={styles.statLabel}>Reward</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {formatDate(daily.lastCompletedDate) === formatDate(today)
                  ? '✓'
                  : '—'}
              </Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
          </View>

          <PrimaryButton
            title={alreadyDone ? 'PLAY AGAIN' : 'START CHALLENGE'}
            onPress={onStart}
            variant="warm"
            icon={<IconPlaySvg width={22} height={22} />}
          />
          <View style={styles.note}>
            <CoinSvg width={18} height={18} />
            <Text style={styles.noteText}>
              {alreadyDone
                ? 'Bonus coins claimed for today.'
                : `Win to earn ${DAILY_REWARD} coins and grow your streak.`}
            </Text>
          </View>
        </GlassCard>

        <View style={styles.penguinFloat}>
          <Penguin size={120} characterId={profile.selectedCharacter} />
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 54,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  body: {flex: 1, padding: 24, justifyContent: 'center'},
  card: {alignItems: 'center'},
  calendar: {marginBottom: 8},
  today: {
    color: COLORS.accent,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.4,
    marginTop: 6,
  },
  headline: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
  },
  sub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 14,
    paddingVertical: 12,
    marginVertical: 18,
  },
  statBox: {flex: 1, alignItems: 'center'},
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: 4,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {color: COLORS.textSecondary, fontSize: 11, marginTop: 2},
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  noteText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 6,
  },
  penguinFloat: {alignItems: 'center', marginTop: 14},
});

export default DailyChallengeScreen;
