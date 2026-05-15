import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {COLORS, SIZES} from '../theme/colors';

const PlayerBadge = ({label, sub, color, active}) => {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (active) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      anim.start();
      return () => anim.stop();
    }
  }, [active, pulse]);

  const glow = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View
      style={[
        styles.wrap,
        active ? {opacity: 1} : {opacity: 0.55},
        active ? {shadowOpacity: glow} : null,
      ]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={`pb-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color.from} />
            <Stop offset="100%" stopColor={color.to} />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={SIZES.radiusMd}
          ry={SIZES.radiusMd}
          fill={`url(#pb-${label})`}
        />
      </Svg>
      <View style={styles.shineLine} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: 78,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 6,
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 12,
    elevation: 8,
  },
  shineLine: {
    position: 'absolute',
    top: 6,
    left: 14,
    right: 14,
    height: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  sub: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    fontSize: 13,
    marginTop: 4,
  },
});

export default PlayerBadge;
