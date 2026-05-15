import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS, SIZES} from '../theme/colors';

const GlassCard = ({children, style, padding = 16, radius = SIZES.radiusLg}) => (
  <View
    style={[
      styles.card,
      {padding, borderRadius: radius},
      style,
    ]}>
    <View style={[styles.shine, {borderTopLeftRadius: radius, borderTopRightRadius: radius}]} />
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1.2,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 12,
    elevation: 6,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: COLORS.cardHighlight,
    opacity: 0.5,
  },
});

export default GlassCard;
