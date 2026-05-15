import React, {useRef} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import {COLORS, SIZES} from '../theme/colors';

const IconButton = ({children, onPress, size = 48, style}) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[{transform: [{scale}]}, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(scale, {toValue: 0.9, useNativeDriver: true}).start()
        }
        onPressOut={() =>
          Animated.spring(scale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }).start()
        }
        style={[styles.btn, {width: size, height: size}]}>
        <View style={styles.glass} />
        <View style={styles.content}>{children}</View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: SIZES.radiusFull,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  glass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  content: {alignItems: 'center', justifyContent: 'center'},
});

export default IconButton;
