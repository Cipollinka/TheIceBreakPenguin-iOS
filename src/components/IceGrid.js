import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import IceBlock from './IceBlock';
import Penguin from './Penguin';
import {GRID_SIZE, PENGUIN_ROW, PENGUIN_COL} from '../utils/constants';
import {SIZES} from '../theme/colors';

const {width: SCREEN_W} = Dimensions.get('window');

const IceGrid = ({
  grid,
  onTap,
  disabled,
  fallen,
  victory,
  characterId,
  highlightedBlock,
  frozenBlock,
  shieldActive,
}) => {
  const containerSize = Math.min(SCREEN_W - 32, 360);
  const padding = 14;
  const innerSize = containerSize - padding * 2;
  const blockSize = innerSize / GRID_SIZE;
  const penguinSize = blockSize * 1.6;

  const penguinLeft =
    padding + PENGUIN_COL * blockSize + blockSize / 2 - penguinSize / 2;
  const penguinTop =
    padding + PENGUIN_ROW * blockSize + blockSize / 2 - penguinSize / 2 - blockSize * 0.42;

  return (
    <View style={[styles.outer, {width: containerSize, height: containerSize}]}>
      <Svg
        width={containerSize}
        height={containerSize}
        style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="frameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1B5689" />
            <Stop offset="100%" stopColor="#082E55" />
          </LinearGradient>
          <LinearGradient id="frameInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#08233F" />
            <Stop offset="100%" stopColor="#04162B" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={containerSize}
          height={containerSize}
          rx={SIZES.radiusLg}
          ry={SIZES.radiusLg}
          fill="url(#frameGrad)"
        />
        <Rect
          x={padding / 2}
          y={padding / 2}
          width={containerSize - padding}
          height={containerSize - padding}
          rx={SIZES.radiusMd}
          ry={SIZES.radiusMd}
          fill="url(#frameInner)"
        />
      </Svg>

      <View style={[styles.gridInner, {padding}]}>
        {grid.map((row, r) => (
          <View key={`row-${r}`} style={styles.row}>
            {row.map((block, c) => (
              <IceBlock
                key={`b-${r}-${c}`}
                size={blockSize}
                block={block}
                isPenguinTile={r === PENGUIN_ROW && c === PENGUIN_COL}
                highlight={
                  highlightedBlock &&
                  highlightedBlock.row === r &&
                  highlightedBlock.col === c
                }
                frozen={
                  frozenBlock &&
                  frozenBlock.row === r &&
                  frozenBlock.col === c
                }
                onPress={() => onTap(r, c)}
                disabled={disabled}
              />
            ))}
          </View>
        ))}
      </View>

      <View
        pointerEvents="none"
        style={[
          styles.penguinAnchor,
          {left: penguinLeft, top: penguinTop, width: penguinSize, height: penguinSize},
        ]}>
        <Penguin
          size={penguinSize}
          characterId={characterId}
          falling={fallen}
          cheer={victory}
          variant={fallen ? 'sad' : victory ? 'happy' : 'default'}
        />
        {shieldActive ? <View style={styles.shieldHalo} pointerEvents="none" /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    alignSelf: 'center',
    borderRadius: SIZES.radiusLg,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 12},
    shadowRadius: 20,
    elevation: 12,
  },
  gridInner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  penguinAnchor: {
    position: 'absolute',
  },
  shieldHalo: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#6BD4FF',
    backgroundColor: 'rgba(107, 212, 255, 0.15)',
  },
});

export default IceGrid;
