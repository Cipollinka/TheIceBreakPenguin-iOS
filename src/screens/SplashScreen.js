import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import Penguin from '../components/Penguin';
import {LogoSvg, FishSvg} from '../assets/svg';
import {usePlayer} from '../utils/PlayerContext';
import {COLORS} from '../theme/colors';

const SplashScreen = ({onDone}) => {
  const player = usePlayer();
  const characterId = player?.profile?.selectedCharacter || 'classic';
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;
  const fishX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(fishX, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fishX, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [fade, scale, fishX, onDone]);

  const fishTx = fishX.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  return (
    <ScreenBackground>
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.logoWrap,
            {opacity: fade, transform: [{scale}]},
          ]}>
          <LogoSvg width={280} height={160} />
        </Animated.View>

        <Animated.View style={[styles.penguin, {opacity: fade}]}>
          <Penguin size={140} characterId={characterId} />
        </Animated.View>

        <Animated.View
          style={[
            styles.fish,
            {opacity: fade, transform: [{translateX: fishTx}]},
          ]}>
          <FishSvg width={70} height={50} />
        </Animated.View>

        <Animated.Text style={[styles.tagline, {opacity: fade}]}>
          A frosty turn-based party
        </Animated.Text>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  penguin: {
    marginBottom: 12,
  },
  fish: {
    marginBottom: 18,
  },
  tagline: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.6,
    opacity: 0.85,
  },
});

export default SplashScreen;
