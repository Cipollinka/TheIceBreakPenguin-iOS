import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CoinSvg} from '../assets/svg';
import {COLORS} from '../theme/colors';

const CoinBadge = ({coins, compact = false}) => (
  <View style={[styles.wrap, compact ? styles.compact : null]}>
    <CoinSvg width={compact ? 20 : 26} height={compact ? 20 : 26} />
    <Text style={[styles.text, compact ? styles.textCompact : null]}>
      {coins}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 107, 0.4)',
  },
  compact: {paddingHorizontal: 8, paddingVertical: 3},
  text: {
    color: COLORS.accent,
    fontWeight: '900',
    fontSize: 16,
    marginLeft: 6,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  textCompact: {fontSize: 13},
});

export default CoinBadge;
