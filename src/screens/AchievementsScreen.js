import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import IconButton from '../components/IconButton';
import GlassCard from '../components/GlassCard';
import {IconBackSvg, IconTrophySvg, CoinSvg, IconLockSvg} from '../assets/svg';
import {ACHIEVEMENTS} from '../utils/achievements';
import {usePlayer} from '../utils/PlayerContext';
import {COLORS} from '../theme/colors';

const AchievementsScreen = ({onBack}) => {
  const {profile} = usePlayer();
  const unlockedMap = profile.achievements || {};
  const totalUnlocked = Object.keys(unlockedMap).length;
  const pct = Math.round((totalUnlocked / ACHIEVEMENTS.length) * 100);

  return (
    <ScreenBackground>
      <View style={styles.topRow}>
        <IconButton onPress={onBack}>
          <IconBackSvg width={22} height={22} />
        </IconButton>
        <Text style={styles.title}>Achievements</Text>
        <View style={{width: 48}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.summary} padding={20}>
          <IconTrophySvg width={64} height={64} />
          <View style={{flex: 1, marginLeft: 14}}>
            <Text style={styles.sumTitle}>Progress</Text>
            <Text style={styles.sumSub}>
              {totalUnlocked} of {ACHIEVEMENTS.length} unlocked
            </Text>
            <View style={styles.barOuter}>
              <View style={[styles.barInner, {width: `${pct}%`}]} />
            </View>
            <Text style={styles.percent}>{pct}%</Text>
          </View>
        </GlassCard>

        {ACHIEVEMENTS.map(ach => {
          const unlocked = !!unlockedMap[ach.id];
          return (
            <GlassCard
              key={ach.id}
              style={[styles.row, unlocked ? styles.rowUnlocked : null]}
              padding={14}>
              <View style={styles.iconBox}>
                {unlocked ? (
                  <IconTrophySvg width={36} height={36} />
                ) : (
                  <IconLockSvg width={28} height={28} />
                )}
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={[styles.name, unlocked ? styles.nameUnlocked : null]}>
                  {ach.name}
                </Text>
                <Text style={styles.desc}>{ach.desc}</Text>
              </View>
              <View style={styles.rewardBox}>
                <CoinSvg width={20} height={20} />
                <Text style={styles.rewardText}>+{ach.reward}</Text>
              </View>
            </GlassCard>
          );
        })}
      </ScrollView>
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
  scroll: {padding: 24, paddingBottom: 40},
  summary: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  sumTitle: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 16,
  },
  sumSub: {color: COLORS.textSecondary, fontSize: 12, marginTop: 2},
  barOuter: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
    marginTop: 8,
  },
  barInner: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  percent: {
    color: COLORS.accent,
    fontWeight: '900',
    fontSize: 18,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    opacity: 0.7,
  },
  rowUnlocked: {opacity: 1, borderColor: COLORS.accent, borderWidth: 1.5},
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 15,
  },
  nameUnlocked: {color: COLORS.accent},
  desc: {color: COLORS.textSecondary, fontSize: 12, marginTop: 2},
  rewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 6,
  },
  rewardText: {
    color: COLORS.accent,
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default AchievementsScreen;
