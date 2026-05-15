import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Pressable, StyleSheet, View} from 'react-native';
import {
  IceBlock1Svg,
  IceBlock2Svg,
  IceBlock3Svg,
  IceCrackedSvg,
  IceHoleSvg,
  FishSvg,
  IconFreezeSvg,
} from '../assets/svg';
import {BLOCK_STATE} from '../utils/constants';

const variantMap = {
  1: IceBlock1Svg,
  2: IceBlock2Svg,
  3: IceBlock3Svg,
};

const IceBlock = ({
  size,
  block,
  isPenguinTile,
  onPress,
  disabled,
  highlight,
  frozen,
}) => {
  const Variant = variantMap[block.variant] || IceBlock1Svg;
  const press = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const highlightPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (block.state === BLOCK_STATE.CRACKED) {
      shake.setValue(0);
      Animated.sequence([
        Animated.timing(shake, {
          toValue: 1,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: -1,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
    if (block.state === BLOCK_STATE.BROKEN) {
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [block.state, shake, opacity]);

  useEffect(() => {
    if (highlight) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(highlightPulse, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(highlightPulse, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      anim.start();
      return () => anim.stop();
    }
    highlightPulse.setValue(0);
  }, [highlight, highlightPulse]);

  const handlePressIn = () =>
    Animated.spring(press, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  const handlePressOut = () =>
    Animated.spring(press, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

  const translateX = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: [-3, 3],
  });

  const highlightOpacity = highlightPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.85],
  });

  let content;
  if (block.state === BLOCK_STATE.BROKEN) {
    content = (
      <Animated.View style={{opacity}}>
        <IceHoleSvg width={size} height={size} />
      </Animated.View>
    );
  } else if (block.state === BLOCK_STATE.CRACKED) {
    content = <IceCrackedSvg width={size} height={size} />;
  } else {
    content = <Variant width={size} height={size} />;
  }

  return (
    <Animated.View
      style={[
        styles.wrap,
        {width: size, height: size, transform: [{scale: press}, {translateX}]},
      ]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || block.state === BLOCK_STATE.BROKEN || frozen}
        style={styles.pressable}
        hitSlop={2}>
        {content}
        {block.hasFish && block.state === BLOCK_STATE.CRACKED ? (
          <View style={styles.fishPeek} pointerEvents="none">
            <FishSvg width={size * 0.45} height={size * 0.34} />
          </View>
        ) : null}
        {isPenguinTile && block.state !== BLOCK_STATE.BROKEN ? (
          <View style={styles.penguinHint} pointerEvents="none" />
        ) : null}
        {frozen && block.state !== BLOCK_STATE.BROKEN ? (
          <View style={styles.frozenOverlay} pointerEvents="none">
            <IconFreezeSvg width={size * 0.5} height={size * 0.5} />
          </View>
        ) : null}
        {highlight && block.state !== BLOCK_STATE.BROKEN ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.radarHighlight, {opacity: highlightOpacity}]}
          />
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', justifyContent: 'center'},
  pressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  penguinHint: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 216, 107, 0.55)',
  },
  fishPeek: {
    position: 'absolute',
    bottom: 6,
    right: 4,
    transform: [{rotate: '-10deg'}],
    opacity: 0.85,
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(140, 215, 255, 0.35)',
    borderRadius: 6,
  },
  radarHighlight: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#5CE38F',
    backgroundColor: 'rgba(92, 227, 143, 0.18)',
  },
});

export default IceBlock;
