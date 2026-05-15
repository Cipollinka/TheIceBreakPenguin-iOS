import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import IconButton from '../components/IconButton';
import GlassCard from '../components/GlassCard';
import Penguin from '../components/Penguin';
import CoinBadge from '../components/CoinBadge';
import {
  IconBackSvg,
  IconSoundOnSvg,
  IconSoundOffSvg,
} from '../assets/svg';
import {usePlayer} from '../utils/PlayerContext';
import {COLORS} from '../theme/colors';

const Toggle = ({value, onChange}) => (
  <Pressable
    onPress={() => onChange(!value)}
    style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}>
    <View style={[styles.knob, value ? styles.knobOn : styles.knobOff]} />
  </Pressable>
);

const Row = ({icon, title, subtitle, value, onChange}) => (
  <GlassCard style={styles.row} padding={16}>
    <View style={styles.iconBox}>{icon}</View>
    <View style={{flex: 1}}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSub}>{subtitle}</Text>
    </View>
    <Toggle value={value} onChange={onChange} />
  </GlassCard>
);

const SettingsScreen = ({onBack}) => {
  const {profile, updateSetting, resetProfile} = usePlayer();
  const sound = profile.settings.sound;
  const vibration = profile.settings.vibration;
  const bestScore = profile.bestSurvival;

  return (
    <ScreenBackground>
      <View style={styles.topRow}>
        <IconButton onPress={onBack}>
          <IconBackSvg width={22} height={22} />
        </IconButton>
        <Text style={styles.title}>Settings</Text>
        <CoinBadge coins={profile.coins} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Penguin size={120} characterId={profile.selectedCharacter} />
        </View>

        <Row
          icon={
            sound ? (
              <IconSoundOnSvg width={28} height={28} />
            ) : (
              <IconSoundOffSvg width={28} height={28} />
            )
          }
          title="Sound effects"
          subtitle="Ice cracks and penguin reactions"
          value={sound}
          onChange={v => updateSetting('sound', v)}
        />
        <Row
          icon={<IconSoundOnSvg width={28} height={28} />}
          title="Haptic feedback"
          subtitle="Vibrate on taps and breaks"
          value={vibration}
          onChange={v => updateSetting('vibration', v)}
        />

        <GlassCard style={styles.bestCard} padding={16}>
          <View style={{flex: 1}}>
            <Text style={styles.bestTitle}>Best Survival Streak</Text>
            <Text style={styles.bestSub}>
              Highest number of blocks broken in Survival mode
            </Text>
          </View>
          <Text style={styles.bestVal}>{bestScore}</Text>
        </GlassCard>

        <Pressable onPress={resetProfile} style={styles.resetBtn}>
          <Text style={styles.resetText}>Reset all progress</Text>
        </Pressable>

        <Text style={styles.about}>
          Don't Break the Ice {`\n`}A frosty turn-based party game.
        </Text>
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
  hero: {alignItems: 'center', marginBottom: 14},
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  rowSub: {color: COLORS.textSecondary, fontSize: 12, marginTop: 2},
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 16,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {backgroundColor: COLORS.accent},
  toggleOff: {backgroundColor: 'rgba(255,255,255,0.18)'},
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
  },
  knobOn: {alignSelf: 'flex-end'},
  knobOff: {alignSelf: 'flex-start'},
  bestCard: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  bestTitle: {color: COLORS.textPrimary, fontWeight: '800', fontSize: 15},
  bestSub: {color: COLORS.textSecondary, fontSize: 12, marginTop: 2},
  bestVal: {
    color: COLORS.accent,
    fontSize: 30,
    fontWeight: '900',
    marginLeft: 14,
  },
  resetBtn: {
    alignSelf: 'center',
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  resetText: {color: COLORS.textSecondary, fontSize: 13, fontWeight: '600'},
  about: {
    color: COLORS.textSecondary,
    marginTop: 26,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SettingsScreen;
