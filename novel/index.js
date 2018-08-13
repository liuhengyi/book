/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import setup from './app/setup'

AppRegistry.registerComponent(appName, () => setup);
