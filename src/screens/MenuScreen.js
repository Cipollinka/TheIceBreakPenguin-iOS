import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import PrimaryButton from '../components/PrimaryButton';
import IconButton from '../components/IconButton';
import CoinBadge from '../components/CoinBadge';
import Penguin from '../components/Penguin';
import {
  IconHelpSvg,
  IconSettingsSvg,
  IconPlaySvg,
  LogoSvg,
  IconCalendarSvg,
  IconCollectionSvg,
  IconTrophySvg,
  IconStatsSvg,
  FishRedBigSvg,
} from '../assets/svg';
import {usePlayer} from '../utils/PlayerContext';
import {COLORS} from '../theme/colors';

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
const FISH_W = SCREEN_W * 1.1;
const FISH_H = FISH_W * 0.75;

const Tile = ({title, icon, onPress, accent, danger}) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.tile,
      accent ? styles.tileAccent : null,
      danger ? styles.tileDanger : null,
    ]}>
    <View style={styles.tileIcon}>{icon}</View>
    <Text style={styles.tileLabel}>{title}</Text>
  </Pressable>
);

const MenuScreen = ({
  onPlay,
  onHowToPlay,
  onSettings,
  onDaily,
  onCollection,
  onAchievements,
  onStats,
}) => {
  const {profile} = usePlayer();
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [float]);

  const fishTranslateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 14],
  });
  const fishTranslateX = float.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 8],
  });

  return (
    <ScreenBackground>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bigFish,
          {
            width: FISH_W,
            height: FISH_H,
            transform: [
              {translateX: fishTranslateX},
              {translateY: fishTranslateY},
              {rotate: '-45deg'},
            ],
          },
        ]}>
        <FishRedBigSvg width={FISH_W} height={FISH_H} />
      </Animated.View>

      <View style={styles.redGlow} pointerEvents="none" />

      <View style={styles.topRow}>
        <IconButton onPress={onHowToPlay}>
          <IconHelpSvg width={26} height={26} />
        </IconButton>
        <CoinBadge coins={profile.coins} />
        <IconButton onPress={onSettings}>
          <IconSettingsSvg width={26} height={26} />
        </IconButton>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <LogoSvg width={290} height={160} />
          <View style={styles.penguinFloat}>
            <Penguin size={150} characterId={profile.selectedCharacter} />
          </View>
        </View>

        <PrimaryButton
          title="PLAY"
          onPress={onPlay}
          icon={<IconPlaySvg width={22} height={22} />}
          variant="danger"
        />

        <View style={styles.tileRow}>
          <Tile
            title="Daily"
            onPress={onDaily}
            icon={<IconCalendarSvg width={36} height={36} />}
            danger
          />
          <Tile
            title="Penguins"
            onPress={onCollection}
            icon={<IconCollectionSvg width={36} height={36} />}
          />
        </View>
        <View style={styles.tileRow}>
          <Tile
            title="Achievements"
            onPress={onAchievements}
            icon={<IconTrophySvg width={36} height={36} />}
          />
          <Tile
            title="Stats"
            onPress={onStats}
            icon={<IconStatsSvg width={36} height={36} />}
            danger
          />
        </View>

        <Text style={styles.footer}>
          Don't break the ice — keep the penguin safe
        </Text>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  bigFish: {
    position: 'absolute',
    top: SCREEN_H * 0.22,
    left: -SCREEN_W * 0.15,
    opacity: 0.55,
  },
  redGlow: {
    position: 'absolute',
    top: SCREEN_H * 0.32,
    left: SCREEN_W * 0.12,
    width: SCREEN_W * 0.78,
    height: SCREEN_W * 0.78,
    borderRadius: SCREEN_W * 0.4,
    backgroundColor: COLORS.redGlow,
    opacity: 0.55,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 54,
  },
  scroll: {paddingHorizontal: 24, paddingBottom: 40},
  hero: {
    alignItems: 'center',
    height: 320,
    justifyContent: 'center',
  },
  penguinFloat: {marginTop: -18},
  tileRow: {flexDirection: 'row', marginTop: 12},
  tile: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1.2,
    borderColor: COLORS.cardBorder,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  tileAccent: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(255, 216, 107, 0.12)',
  },
  tileDanger: {
    borderColor: COLORS.red,
    backgroundColor: COLORS.redSoft,
  },
  tileIcon: {marginBottom: 8},
  tileLabel: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.4,
  },
  footer: {
    color: COLORS.textSecondary,
    marginTop: 24,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default MenuScreen;
