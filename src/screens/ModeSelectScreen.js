import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import IconButton from '../components/IconButton';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import {
  IconBackSvg,
  IconBotSvg,
  IconTwoPlayersSvg,
  IconSurvivalSvg,
} from '../assets/svg';
import {COLORS} from '../theme/colors';
import {DIFFICULTY, GAME_MODE} from '../utils/constants';

const ModeCard = ({title, subtitle, icon, selected, onPress}) => (
  <Pressable onPress={onPress} style={styles.modeWrap}>
    <GlassCard
      style={[styles.modeCard, selected ? styles.modeCardActive : null]}
      padding={16}>
      <View style={styles.iconBox}>{icon}</View>
      <View style={{flex: 1}}>
        <Text style={styles.modeTitle}>{title}</Text>
        <Text style={styles.modeSub}>{subtitle}</Text>
      </View>
      <View style={[styles.radio, selected ? styles.radioOn : null]} />
    </GlassCard>
  </Pressable>
);

const DiffChip = ({label, active, onPress}) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, active ? styles.chipActive : null]}>
    <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
      {label}
    </Text>
  </Pressable>
);

const ModeSelectScreen = ({onBack, onStart}) => {
  const [mode, setMode] = useState(GAME_MODE.VS_AI);
  const [difficulty, setDifficulty] = useState(DIFFICULTY.NORMAL);

  return (
    <ScreenBackground>
      <View style={styles.topRow}>
        <IconButton onPress={onBack}>
          <IconBackSvg width={22} height={22} />
        </IconButton>
        <Text style={styles.title}>Choose Mode</Text>
        <View style={{width: 48}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <ModeCard
          title="Vs CPU"
          subtitle="Outsmart the icy AI penguin keeper"
          icon={<IconBotSvg width={44} height={44} />}
          selected={mode === GAME_MODE.VS_AI}
          onPress={() => setMode(GAME_MODE.VS_AI)}
        />
        <ModeCard
          title="2 Players"
          subtitle="Pass-and-play with a friend"
          icon={<IconTwoPlayersSvg width={44} height={44} />}
          selected={mode === GAME_MODE.TWO_PLAYER}
          onPress={() => setMode(GAME_MODE.TWO_PLAYER)}
        />
        <ModeCard
          title="Survival"
          subtitle="Solo — last as long as you can"
          icon={<IconSurvivalSvg width={44} height={44} />}
          selected={mode === GAME_MODE.SURVIVAL}
          onPress={() => setMode(GAME_MODE.SURVIVAL)}
        />

        {mode === GAME_MODE.VS_AI ? (
          <GlassCard style={styles.diffCard} padding={16}>
            <Text style={styles.diffTitle}>AI Difficulty</Text>
            <View style={styles.chipRow}>
              <DiffChip
                label="Easy"
                active={difficulty === DIFFICULTY.EASY}
                onPress={() => setDifficulty(DIFFICULTY.EASY)}
              />
              <DiffChip
                label="Normal"
                active={difficulty === DIFFICULTY.NORMAL}
                onPress={() => setDifficulty(DIFFICULTY.NORMAL)}
              />
              <DiffChip
                label="Hard"
                active={difficulty === DIFFICULTY.HARD}
                onPress={() => setDifficulty(DIFFICULTY.HARD)}
              />
            </View>
          </GlassCard>
        ) : null}

        <View style={{height: 14}} />
        <PrimaryButton
          title="START GAME"
          onPress={() => onStart({mode, difficulty})}
          variant="warm"
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
    paddingBottom: 4,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  scroll: {padding: 24, paddingBottom: 40},
  modeWrap: {marginBottom: 14},
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeCardActive: {
    borderColor: COLORS.accent,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 216, 107, 0.12)',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  modeTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  modeSub: {color: COLORS.textSecondary, fontSize: 13},
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    marginLeft: 10,
  },
  radioOn: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  diffCard: {marginTop: 6, marginBottom: 4},
  diffTitle: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },
  chipRow: {flexDirection: 'row', justifyContent: 'space-between'},
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.18)',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: 'rgba(255, 216, 107, 0.22)',
    borderColor: COLORS.accent,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  chipTextActive: {color: COLORS.accent},
});

export default ModeSelectScreen;
