import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';
import {PenguinSadSvg, PenguinHappySvg} from '../assets/svg';
import {getCharacter} from '../utils/characters';

const Penguin = ({
  size = 120,
  variant = 'default',
  characterId = 'classic',
  bobbing = true,
  falling = false,
  cheer = false,
}) => {
  const character = getCharacter(characterId);
  const Comp =
    variant === 'sad'
      ? PenguinSadSvg
      : variant === 'happy'
      ? PenguinHappySvg
      : character.svg;

  const bob = useRef(new Animated.Value(0)).current;
  const fall = useRef(new Animated.Value(0)).current;
  const cheerVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (bobbing && !falling) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(bob, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(bob, {
            toValue: 0,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
      anim.start();
      return () => anim.stop();
    }
  }, [bob, bobbing, falling]);

  useEffect(() => {
    if (falling) {
      fall.setValue(0);
      Animated.timing(fall, {
        toValue: 1,
        duration: 900,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      fall.setValue(0);
    }
  }, [falling, fall]);

  useEffect(() => {
    if (cheer) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(cheerVal, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(cheerVal, {
            toValue: 0,
            duration: 400,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );
      anim.start();
      return () => anim.stop();
    }
  }, [cheer, cheerVal]);

  const bobTranslate = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });
  const fallTranslate = fall.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size * 1.4],
  });
  const fallRotate = fall.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '60deg'],
  });
  const fallOpacity = fall.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1, 0.6],
  });
  const cheerTranslate = cheerVal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          opacity: fallOpacity,
          transform: [
            {
              translateY: Animated.add(
                bobTranslate,
                Animated.add(fallTranslate, cheerTranslate),
              ),
            },
            {rotate: fallRotate},
          ],
        },
      ]}>
      <Comp width={size} height={size} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', justifyContent: 'center'},
});

export default Penguin;
