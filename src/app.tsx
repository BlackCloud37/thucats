import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from './models/store';
import { cloud } from 'remax/wechat';
import './app.css';
import '@/styles/tailwind.css';
import { useAppEvent } from '@remax/framework-shared';
import { getPersistor } from '@rematch/persist';
import { PersistGate } from 'redux-persist/es/integration/react';
const persistor = getPersistor();

const App: React.FC = (props) => {
  useAppEvent('onLaunch', () => {
    cloud.init({
      env: process.env.REMAX_APP_ENVID
    });
  });
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{props.children}</PersistGate>
    </Provider>
  );
};
export default App;
