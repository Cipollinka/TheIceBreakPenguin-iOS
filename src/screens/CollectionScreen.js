import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import IconButton from '../components/IconButton';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import CoinBadge from '../components/CoinBadge';
import Penguin from '../components/Penguin';
import {IconBackSvg, IconLockSvg, CoinSvg} from '../assets/svg';
import {CHARACTERS, getCharacter} from '../utils/characters';
import {usePlayer} from '../utils/PlayerContext';
import {COLORS} from '../theme/colors';

const CollectionScreen = ({onBack}) => {
  const {profile, unlockCharacter, selectCharacter} = usePlayer();
  const [selectedId, setSelectedId] = useState(profile.selectedCharacter);

  const selected = getCharacter(selectedId);
  const isUnlocked = profile.unlockedCharacters.includes(selectedId);
  const isEquipped = profile.selectedCharacter === selectedId;
  const canAfford = profile.coins >= selected.cost;

  const handleAction = () => {
    if (!isUnlocked) {
      const ok = unlockCharacter(selectedId);
      if (ok) selectCharacter(selectedId);
    } else if (!isEquipped) {
      selectCharacter(selectedId);
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.topRow}>
        <IconButton onPress={onBack}>
          <IconBackSvg width={22} height={22} />
        </IconButton>
        <Text style={styles.title}>Collection</Text>
        <CoinBadge coins={profile.coins} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.preview} padding={20}>
          <View style={styles.previewPenguin}>
            <Penguin
              size={170}
              characterId={selectedId}
              variant={isUnlocked ? 'default' : 'sad'}
            />
            {!isUnlocked ? (
              <View style={styles.lockOverlay}>
                <IconLockSvg width={42} height={42} />
              </View>
            ) : null}
          </View>
          <Text style={styles.charName}>{selected.name}</Text>
          <Text style={styles.charTitle}>{selected.title}</Text>
          <Text style={styles.charPerk}>{selected.perk}</Text>

          {isUnlocked ? (
            <PrimaryButton
              title={isEquipped ? 'EQUIPPED' : 'EQUIP'}
              variant={isEquipped ? 'cool' : 'warm'}
              disabled={isEquipped}
              onPress={handleAction}
            />
          ) : (
            <PrimaryButton
              title={`UNLOCK · ${selected.cost}`}
              variant="warm"
              disabled={!canAfford}
              onPress={handleAction}
              icon={<CoinSvg width={20} height={20} />}
            />
          )}
          {!isUnlocked && !canAfford ? (
            <Text style={styles.needCoins}>
              Earn more coins by playing matches and catching fish.
            </Text>
          ) : null}
        </GlassCard>

        <Text style={styles.sectionLabel}>All Penguins</Text>
        <View style={styles.grid}>
          {CHARACTERS.map(c => {
            const unlocked = profile.unlockedCharacters.includes(c.id);
            const equipped = profile.selectedCharacter === c.id;
            const isSel = selectedId === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setSelectedId(c.id)}
                style={[
                  styles.cell,
                  isSel ? styles.cellActive : null,
                  equipped ? styles.cellEquipped : null,
                ]}>
                <Penguin
                  size={64}
                  characterId={c.id}
                  bobbing={false}
                  variant={unlocked ? 'default' : 'sad'}
                />
                <Text style={styles.cellName}>{c.name}</Text>
                {!unlocked ? (
                  <View style={styles.cellLock}>
                    <IconLockSvg width={18} height={18} />
                  </View>
                ) : null}
                {equipped ? <View style={styles.dot} /> : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 54,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  scroll: {padding: 24, paddingBottom: 40},
  preview: {alignItems: 'center', marginBottom: 18},
  previewPenguin: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    width: 180,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  charName: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 12,
  },
  charTitle: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  charPerk: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 14,
  },
  needCoins: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 6,
  },
  sectionLabel: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    width: '31%',
    aspectRatio: 0.85,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  cellActive: {
    borderColor: COLORS.accent,
    borderWidth: 2.4,
    backgroundColor: 'rgba(255, 216, 107, 0.12)',
  },
  cellEquipped: {
    backgroundColor: 'rgba(107, 212, 255, 0.15)',
  },
  cellName: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  cellLock: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  dot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5CE38F',
  },
});

export default CollectionScreen;
