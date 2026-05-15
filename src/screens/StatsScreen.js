import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import IconButton from '../components/IconButton';
import GlassCard from '../components/GlassCard';
import {
  IconBackSvg,
  TrophySvg,
  FishSvg,
  HammerSvg,
  IconBotSvg,
  IconSurvivalSvg,
  IconStatsSvg,
} from '../assets/svg';
import {usePlayer} from '../utils/PlayerContext';
import {COLORS} from '../theme/colors';

const Stat = ({icon, label, value}) => (
  <GlassCard style={styles.stat} padding={14}>
    <View style={styles.statIcon}>{icon}</View>
    <View style={{flex: 1}}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </GlassCard>
);

const StatsScreen = ({onBack}) => {
  const {profile, achievementsList} = usePlayer();
  const unlockedAchievements = Object.keys(profile.achievements || {}).length;

  const winRate =
    profile.totalGames > 0
      ? Math.round(((profile.winsVsAi || 0) / profile.totalGames) * 100)
      : 0;

  return (
    <ScreenBackground>
      <View style={styles.topRow}>
        <IconButton onPress={onBack}>
          <IconBackSvg width={22} height={22} />
        </IconButton>
        <Text style={styles.title}>Statistics</Text>
        <View style={{width: 48}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.headerCard} padding={20}>
          <View style={styles.headerLeft}>
            <IconStatsSvg width={56} height={56} />
          </View>
          <View style={{flex: 1, marginLeft: 14}}>
            <Text style={styles.headerLabel}>Lifetime stats</Text>
            <Text style={styles.headerNum}>{profile.totalGames}</Text>
            <Text style={styles.headerSub}>games played</Text>
          </View>
        </GlassCard>

        <Stat
          icon={<TrophySvg width={36} height={36} />}
          label="CPU wins"
          value={profile.winsVsAi || 0}
        />
        <Stat
          icon={<IconBotSvg width={36} height={36} />}
          label="Win rate"
          value={`${winRate}%`}
        />
        <Stat
          icon={<IconSurvivalSvg width={36} height={36} />}
          label="Best survival"
          value={profile.bestSurvival || 0}
        />
        <Stat
          icon={<HammerSvg width={36} height={36} />}
          label="Blocks broken"
          value={profile.totalBlocksBroken || 0}
        />
        <Stat
          icon={<FishSvg width={36} height={28} />}
          label="Fish caught"
          value={profile.fishCaught || 0}
        />
        <Stat
          icon={<TrophySvg width={36} height={36} />}
          label="Achievements"
          value={`${unlockedAchievements} / ${achievementsList.length}`}
        />
        <Stat
          icon={<TrophySvg width={36} height={36} />}
          label="Daily streak"
          value={profile.dailyChallenge?.streak || 0}
        />
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
  headerCard: {flexDirection: 'row', alignItems: 'center', marginBottom: 14},
  headerLeft: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerNum: {
    color: COLORS.textPrimary,
    fontWeight: '900',
    fontSize: 36,
    marginTop: 2,
  },
  headerSub: {color: COLORS.textSecondary, fontSize: 12, marginTop: 2},
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statLabel: {color: COLORS.textSecondary, fontSize: 12, fontWeight: '600'},
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
});

export default StatsScreen;
