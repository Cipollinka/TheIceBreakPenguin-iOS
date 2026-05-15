/**
 * @format
 */

import { AppRegistry } from 'react-native';
import AppManager from './src/AppManager/AppManager';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppManager);
