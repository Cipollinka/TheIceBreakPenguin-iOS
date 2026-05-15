import React, { useState, useEffect, useRef } from 'react';
import { Image, View, Animated, Text } from 'react-native';

const fullScreenStyle = {
  flex: 1,
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center'
};

const loadingContainer = {
  position: 'absolute',
  bottom: 60,
  width: '100%',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center'
};

export default function LoaderRoot() {
  const frames = [
    // require('./src/Slice1.jpeg'),
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCurrent(1), 1000);
    return () => clearTimeout(timer);
  }, []);

  const dotAnims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const createAnim = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -10, duration: 100, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 100, useNativeDriver: true }),
          Animated.delay(100),
        ])
      );

    const anims = dotAnims.map((dot, i) => createAnim(dot, i * 150));
    anims.forEach(anim => anim.start());
    return () => anims.forEach(anim => anim.stop());
  }, []);

  return (
    <View style={fullScreenStyle}>
      {/* <Image source={require('./src/Slice1.jpeg')} style={fullScreenStyle} /> */}
      <View style={loadingContainer}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '500'}}>Loading</Text>
        {dotAnims.map((anim, i) => (
          <Animated.Text
            key={i}
            style={{
              color: 'white',
              fontSize: 22,
              fontWeight: 'bold',
              marginLeft: 2,
              transform: [{ translateY: anim }]
            }}
          >
            .
          </Animated.Text>
        ))}
      </View>
    </View>
  );
}
