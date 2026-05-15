import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, View, Dimensions} from 'react-native';
import {SnowflakeSvg, SnowflakeSmallSvg} from '../assets/svg';

const {width, height} = Dimensions.get('window');

const FLAKES = Array.from({length: 16}).map((_, i) => ({
  key: `flake-${i}`,
  startX: Math.random() * width,
  duration: 6000 + Math.random() * 5000,
  delay: Math.random() * 4000,
  size: 8 + Math.random() * 16,
  drift: (Math.random() - 0.5) * 50,
  small: Math.random() > 0.55,
  rotate: Math.random() > 0.5,
}));

const Flake = ({flake}) => {
  const fall = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopFall = () => {
      fall.setValue(0);
      Animated.timing(fall, {
        toValue: 1,
        duration: flake.duration,
        delay: flake.delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(loopFall);
    };
    const loopSpin = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 5000 + Math.random() * 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loopFall();
    loopSpin.start();
    return () => loopSpin.stop();
  }, [fall, spin, flake.duration, flake.delay]);

  const translateY = fall.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, height + 40],
  });
  const translateX = fall.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, flake.drift, 0],
  });
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const opacity = fall.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 0.85, 0.85, 0],
  });

  const Svg = flake.small ? SnowflakeSmallSvg : SnowflakeSvg;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.flake,
        {
          left: flake.startX,
          width: flake.size,
          height: flake.size,
          transform: [
            {translateY},
            {translateX},
            ...(flake.rotate ? [{rotate}] : []),
          ],
          opacity,
        },
      ]}>
      <Svg width={flake.size} height={flake.size} />
    </Animated.View>
  );
};

const Snowfall = () => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {FLAKES.map(f => (
      <Flake key={f.key} flake={f} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  flake: {
    position: 'absolute',
    top: 0,
  },
});

export default Snowfall;
