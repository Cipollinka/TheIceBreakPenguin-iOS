import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';
import {FishSvg} from '../assets/svg';

const FishPopup = ({x, y, onDone}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => onDone && onDone());
  }, [anim, onDone]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });
  const scale = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.1, 0.9],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          left: x - 28,
          top: y - 24,
          opacity,
          transform: [{translateY}, {scale}],
        },
      ]}>
      <FishSvg width={56} height={42} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {position: 'absolute'},
});

export default FishPopup;
