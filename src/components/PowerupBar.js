import React, {useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  PowerupLightningSvg,
  PowerupFreezeSvg,
  PowerupRadarSvg,
  PowerupShieldSvg,
} from '../assets/svg';
import {POWERUP} from '../utils/constants';
import {COLORS} from '../theme/colors';

const SVGS = {
  [POWERUP.LIGHTNING]: PowerupLightningSvg,
  [POWERUP.FREEZE]: PowerupFreezeSvg,
  [POWERUP.RADAR]: PowerupRadarSvg,
  [POWERUP.SHIELD]: PowerupShieldSvg,
};

const SHORT_NAMES = {
  [POWERUP.LIGHTNING]: 'Lightning',
  [POWERUP.FREEZE]: 'Freeze',
  [POWERUP.RADAR]: 'Radar',
  [POWERUP.SHIELD]: 'Shield',
};

const PowerupChip = ({id, count, active, disabled, onPress}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const Svg = SVGS[id];
  const empty = count <= 0;

  return (
    <Animated.View style={[styles.chipWrap, {transform: [{scale}]}]}>
      <Pressable
        onPress={empty || disabled ? null : onPress}
        onPressIn={() =>
          Animated.spring(scale, {
            toValue: 0.92,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }).start()
        }
        style={[
          styles.chip,
          active ? styles.chipActive : null,
          empty ? styles.chipEmpty : null,
          disabled ? styles.chipDisabled : null,
        ]}>
        <Svg width={36} height={36} />
        <Text style={styles.name}>{SHORT_NAMES[id]}</Text>
        <View style={[styles.badge, empty ? styles.badgeEmpty : null]}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const PowerupBar = ({loadout, activePowerup, onSelect, disabled}) => (
  <View style={styles.row}>
    {[POWERUP.LIGHTNING, POWERUP.FREEZE, POWERUP.RADAR, POWERUP.SHIELD].map(id => (
      <PowerupChip
        key={id}
        id={id}
        count={loadout[id] || 0}
        active={activePowerup === id}
        disabled={disabled}
        onPress={() => onSelect(id)}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: 12,
  },
  chipWrap: {flex: 1, marginHorizontal: 4},
  chip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chipActive: {
    backgroundColor: 'rgba(255, 216, 107, 0.22)',
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  chipEmpty: {opacity: 0.45},
  chipDisabled: {opacity: 0.5},
  name: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmpty: {backgroundColor: 'rgba(255,255,255,0.3)'},
  badgeText: {
    color: '#3A2400',
    fontSize: 11,
    fontWeight: '900',
  },
});

export default PowerupBar;
