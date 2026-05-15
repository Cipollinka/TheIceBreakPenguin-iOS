import React, {useCallback, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import MenuScreen from './src/screens/MenuScreen';
import ModeSelectScreen from './src/screens/ModeSelectScreen';
import GameScreen from './src/screens/GameScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import HowToPlayScreen from './src/screens/HowToPlayScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import StatsScreen from './src/screens/StatsScreen';
import DailyChallengeScreen from './src/screens/DailyChallengeScreen';
import AchievementToast from './src/components/AchievementToast';
import {PlayerProvider, usePlayer} from './src/utils/PlayerContext';
import {GAME_MODE, DIFFICULTY} from './src/utils/constants';

const SCREEN = {
  SPLASH: 'splash',
  MENU: 'menu',
  MODE: 'mode',
  GAME: 'game',
  RESULTS: 'results',
  HOWTO: 'howto',
  SETTINGS: 'settings',
  COLLECTION: 'collection',
  ACHIEVEMENTS: 'achievements',
  STATS: 'stats',
  DAILY: 'daily',
};

const Navigator = () => {
  const {loaded, achievementToast} = usePlayer();
  const [screen, setScreen] = useState(SCREEN.SPLASH);
  const [gameConfig, setGameConfig] = useState({
    mode: GAME_MODE.VS_AI,
    difficulty: DIFFICULTY.NORMAL,
    isDaily: false,
  });
  const [lastResult, setLastResult] = useState(null);

  const handleEnd = useCallback(result => {
    setLastResult(result);
    setScreen(SCREEN.RESULTS);
  }, []);

  const startGame = config => {
    setGameConfig({...config, isDaily: false});
    setScreen(SCREEN.GAME);
  };

  const startDaily = () => {
    setGameConfig({
      mode: GAME_MODE.VS_AI,
      difficulty: DIFFICULTY.NORMAL,
      isDaily: true,
    });
    setScreen(SCREEN.GAME);
  };

  if (!loaded && screen !== SCREEN.SPLASH) {
    return null;
  }

  let content;
  switch (screen) {
    case SCREEN.SPLASH:
      content = <SplashScreen onDone={() => setScreen(SCREEN.MENU)} />;
      break;
    case SCREEN.MENU:
      content = (
        <MenuScreen
          onPlay={() => setScreen(SCREEN.MODE)}
          onHowToPlay={() => setScreen(SCREEN.HOWTO)}
          onSettings={() => setScreen(SCREEN.SETTINGS)}
          onDaily={() => setScreen(SCREEN.DAILY)}
          onCollection={() => setScreen(SCREEN.COLLECTION)}
          onAchievements={() => setScreen(SCREEN.ACHIEVEMENTS)}
          onStats={() => setScreen(SCREEN.STATS)}
        />
      );
      break;
    case SCREEN.MODE:
      content = (
        <ModeSelectScreen
          onBack={() => setScreen(SCREEN.MENU)}
          onStart={startGame}
        />
      );
      break;
    case SCREEN.GAME:
      content = (
        <GameScreen
          mode={gameConfig.mode}
          difficulty={gameConfig.difficulty}
          isDaily={gameConfig.isDaily}
          onExit={() => setScreen(SCREEN.MENU)}
          onEnd={handleEnd}
        />
      );
      break;
    case SCREEN.RESULTS:
      content = (
        <ResultsScreen
          result={lastResult}
          onReplay={() => setScreen(SCREEN.GAME)}
          onMenu={() => setScreen(SCREEN.MENU)}
        />
      );
      break;
    case SCREEN.HOWTO:
      content = <HowToPlayScreen onBack={() => setScreen(SCREEN.MENU)} />;
      break;
    case SCREEN.SETTINGS:
      content = <SettingsScreen onBack={() => setScreen(SCREEN.MENU)} />;
      break;
    case SCREEN.COLLECTION:
      content = <CollectionScreen onBack={() => setScreen(SCREEN.MENU)} />;
      break;
    case SCREEN.ACHIEVEMENTS:
      content = <AchievementsScreen onBack={() => setScreen(SCREEN.MENU)} />;
      break;
    case SCREEN.STATS:
      content = <StatsScreen onBack={() => setScreen(SCREEN.MENU)} />;
      break;
    case SCREEN.DAILY:
      content = (
        <DailyChallengeScreen
          onBack={() => setScreen(SCREEN.MENU)}
          onStart={startDaily}
        />
      );
      break;
    default:
      content = null;
  }

  return (
    <View style={styles.flex}>
      {content}
      <AchievementToast toast={achievementToast} />
    </View>
  );
};

const App = () => (
  <SafeAreaView style={styles.root}>
    <StatusBar barStyle="light-content" backgroundColor="#06203F" />
    <PlayerProvider>
      <Navigator />
    </PlayerProvider>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#06203F'},
  flex: {flex: 1},
});

export default App;
