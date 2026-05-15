import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {BackgroundSvg} from '../assets/svg';
import Snowfall from './Snowfall';

const {width, height} = Dimensions.get('window');

const ScreenBackground = ({children, showSnow = true}) => (
  <View style={styles.root}>
    <View style={StyleSheet.absoluteFill}>
      <BackgroundSvg width={width} height={height} preserveAspectRatio="xMidYMid slice" />
    </View>
    {showSnow ? <Snowfall /> : null}
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#06203F'},
  content: {flex: 1},
});

export default ScreenBackground;
