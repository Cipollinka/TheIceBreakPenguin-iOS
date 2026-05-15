import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import IconButton from '../components/IconButton';
import GlassCard from '../components/GlassCard';
import {
  IconBackSvg,
  HammerSvg,
  IceBlock1Svg,
  IceCrackedSvg,
  IceHoleSvg,
  IconBotSvg,
  IconSurvivalSvg,
  IconTwoPlayersSvg,
  PowerupLightningSvg,
  PowerupFreezeSvg,
  PowerupRadarSvg,
  PowerupShieldSvg,
  FishSvg,
  CoinSvg,
  IconCalendarSvg,
} from '../assets/svg';
import Penguin from '../components/Penguin';
import {COLORS} from '../theme/colors';

const Step = ({n, icon, title, text}) => (
  <GlassCard style={styles.step} padding={16}>
    <View style={styles.stepIcon}>{icon}</View>
    <View style={{flex: 1}}>
      <Text style={styles.stepTitle}>
        <Text style={styles.stepN}>{n}. </Text>
        {title}
      </Text>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  </GlassCard>
);

const ModeRow = ({icon, name, desc}) => (
  <View style={styles.modeRow}>
    <View style={styles.modeIcon}>{icon}</View>
    <View style={{flex: 1}}>
      <Text style={styles.modeName}>{name}</Text>
      <Text style={styles.modeDesc}>{desc}</Text>
    </View>
  </View>
);

const HowToPlayScreen = ({onBack}) => (
  <ScreenBackground>
    <View style={styles.topRow}>
      <IconButton onPress={onBack}>
        <IconBackSvg width={22} height={22} />
      </IconButton>
      <Text style={styles.title}>How to Play</Text>
      <View style={{width: 48}} />
    </View>

    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}>
      <GlassCard style={styles.hero} padding={20}>
        <Penguin size={130} />
        <Text style={styles.heroText}>
          Don't break the ice under the penguin!
        </Text>
        <Text style={styles.heroSub}>
          Take turns tapping ice blocks. Whoever drops the penguin loses.
        </Text>
      </GlassCard>

      <Step
        n="1"
        icon={<HammerSvg width={48} height={48} />}
        title="Take turns"
        text="On your turn, tap any ice block. The first tap cracks it, the second tap shatters it open."
      />
      <Step
        n="2"
        icon={<IceBlock1Svg width={56} height={56} />}
        title="Spot the penguin tile"
        text="The block under the penguin is marked. Don't smash it open — the penguin will fall in!"
      />
      <Step
        n="3"
        icon={<IceCrackedSvg width={56} height={56} />}
        title="Crack carefully"
        text="Cracked blocks signal a hit. Tap one twice in a row and it breaks fully, ending your turn."
      />
      <Step
        n="4"
        icon={<IceHoleSvg width={56} height={56} />}
        title="Mind the supports"
        text="If every neighbour block of the penguin breaks, the centre tile collapses — and so does the penguin."
      />

      <GlassCard style={styles.modesCard} padding={16}>
        <Text style={styles.sectionTitle}>Game Modes</Text>
        <ModeRow
          icon={<IconBotSvg width={32} height={32} />}
          name="Vs CPU"
          desc="Play against a smart icy AI on three difficulty levels."
        />
        <ModeRow
          icon={<IconTwoPlayersSvg width={32} height={32} />}
          name="2 Players"
          desc="Pass-and-play with a friend on the same device."
        />
        <ModeRow
          icon={<IconSurvivalSvg width={32} height={32} />}
          name="Survival"
          desc="Solo run — smash as many blocks as you can before the penguin falls."
        />
        <ModeRow
          icon={<IconCalendarSvg width={32} height={32} />}
          name="Daily Challenge"
          desc="A new seeded puzzle every 24h. Win to earn bonus coins and build a streak."
        />
      </GlassCard>

      <GlassCard style={styles.modesCard} padding={16}>
        <Text style={styles.sectionTitle}>Power-ups</Text>
        <ModeRow
          icon={<PowerupLightningSvg width={32} height={32} />}
          name="Lightning"
          desc="Instantly shatter any block — skip the crack stage entirely."
        />
        <ModeRow
          icon={<PowerupFreezeSvg width={32} height={32} />}
          name="Freeze Turn"
          desc="Pass your turn safely — the opponent has to make a move."
        />
        <ModeRow
          icon={<PowerupRadarSvg width={32} height={32} />}
          name="Radar"
          desc="Reveal the safest block to tap right now (highlighted green)."
        />
        <ModeRow
          icon={<PowerupShieldSvg width={32} height={32} />}
          name="Penguin Shield"
          desc="Block one drop — if you mis-step, the penguin won't fall."
        />
      </GlassCard>

      <GlassCard style={styles.modesCard} padding={16}>
        <Text style={styles.sectionTitle}>Earn Coins</Text>
        <ModeRow
          icon={<FishSvg width={32} height={26} />}
          name="Hidden fish"
          desc="Some ice blocks hide a fish. Crack them open for a coin bonus."
        />
        <ModeRow
          icon={<CoinSvg width={32} height={32} />}
          name="Coin rewards"
          desc="Spend coins on power-ups and unlock new penguin characters."
        />
      </GlassCard>
    </ScrollView>
  </ScreenBackground>
);

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
  hero: {alignItems: 'center', marginBottom: 16},
  heroText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  heroSub: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  stepN: {color: COLORS.accent},
  stepText: {color: COLORS.textSecondary, fontSize: 13, lineHeight: 18},
  modesCard: {marginTop: 6},
  sectionTitle: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 14,
  },
  modeRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modeName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  modeDesc: {color: COLORS.textSecondary, fontSize: 12, marginTop: 2},
});

export default HowToPlayScreen;
