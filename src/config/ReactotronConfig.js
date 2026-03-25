import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import reactotronSaga from 'reactotron-redux-saga';
import AsyncStorage from '@react-native-community/async-storage';
// eslint-disable-next-line import/no-unresolved
import Config from 'react-native-config';

// Define __DEV__ if not already defined globally
if (typeof __DEV__ === 'undefined') {
  global.__DEV__ = process.env.NODE_ENV === 'development';
}

if (__DEV__) {
  // Use environment variable or default to localhost for development
  const reactotronHost = Config.REACTOTRON_HOST || 'localhost';
  const tron = Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({ host: reactotronHost })
    .useReactNative()
    .use(reactotronRedux())
    .use(reactotronSaga())
    .connect();

  tron.clear();

  console.tron = tron;
}
