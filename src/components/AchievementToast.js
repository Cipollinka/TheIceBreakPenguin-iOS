import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import {TrophySvg, CoinSvg} from '../assets/svg';
import {COLORS} from '../theme/colors';

const AchievementToast = ({toast}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) {
      anim.setValue(0);
      return;
    }
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [toast, anim]);

  if (!toast) return null;
  const ach = toast.achievement;
  if (!ach) return null;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, 0],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, {opacity, transform: [{translateY}]}]}>
      <View style={styles.iconBox}>
        <TrophySvg width={50} height={50} />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.label}>ACHIEVEMENT UNLOCKED</Text>
        <Text style={styles.name}>{ach.name}</Text>
        <View style={styles.row}>
          <CoinSvg width={16} height={16} />
          <Text style={styles.reward}>+{ach.reward}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 35, 63, 0.95)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    padding: 12,
    zIndex: 100,
    shadowColor: COLORS.accent,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  iconBox: {marginRight: 12},
  label: {
    color: COLORS.accent,
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 11,
  },
  name: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 16,
    marginTop: 2,
  },
  row: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  reward: {
    color: COLORS.accent,
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default AchievementToast;
