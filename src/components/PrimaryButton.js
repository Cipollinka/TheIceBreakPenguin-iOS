import React, {useRef} from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {Defs, LinearGradient, Stop, Rect} from 'react-native-svg';
import {COLORS, SIZES} from '../theme/colors';

const PrimaryButton = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  fullWidth = true,
  small = false,
  disabled = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  const onOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

  const colors =
    variant === 'primary'
      ? ['#6BD4FF', '#2E8FD9', '#10518A']
      : variant === 'warm'
      ? ['#FFD86B', '#F2A93B', '#B6720C']
      : variant === 'danger'
      ? ['#FF8A8A', '#E04D4D', '#8B1F1F']
      : ['#A7C8E4', '#4A7CAE', '#1F4677'];

  return (
    <Animated.View
      style={[
        styles.wrap,
        {transform: [{scale}]},
        fullWidth ? {alignSelf: 'stretch'} : null,
        disabled ? {opacity: 0.45} : null,
      ]}>
      <Pressable
        onPress={disabled ? null : onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        style={[styles.btn, small ? styles.btnSmall : null]}>
        <Svg
          width="100%"
          height="100%"
          style={StyleSheet.absoluteFill}
          preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={`grad-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colors[0]} />
              <Stop offset="55%" stopColor={colors[1]} />
              <Stop offset="100%" stopColor={colors[2]} />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx={SIZES.radiusLg}
            ry={SIZES.radiusLg}
            fill={`url(#grad-${variant})`}
          />
        </Svg>
        <View style={styles.shineWrap} pointerEvents="none">
          <View style={styles.shine} />
        </View>
        <View style={styles.row}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text
            style={[
              styles.text,
              small ? styles.textSmall : null,
              variant === 'warm' ? {color: '#3A2400'} : null,
            ]}>
            {title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 12,
    elevation: 8,
    marginVertical: 6,
  },
  btn: {
    height: 64,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  btnSmall: {height: 48, borderRadius: SIZES.radiusMd},
  shineWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: SIZES.radiusLg,
  },
  shine: {
    position: 'absolute',
    top: 4,
    left: 12,
    right: 12,
    height: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {marginRight: 10},
  text: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 2,
  },
  textSmall: {fontSize: 16},
});

export default PrimaryButton;
