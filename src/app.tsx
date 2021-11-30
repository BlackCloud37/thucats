import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from './models/store';
import { cloud } from 'remax/wechat';
import './app.css';
import '@/styles/tailwind.css';
import { useAppEvent } from '@remax/framework-shared';
import { getPersistor } from '@rematch/persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import wxRequest from 'wechat-request';
import 'annar/dist/annar.css';

// @ts-ignore
wxRequest.defaults.baseURL = process.env.REMAX_APP_BASE_URL;
// @ts-ignore
wxRequest.defaults.headers['Content-Type'] = 'application/json';
// @ts-ignore
wxRequest.defaults.headers['Authorization'] = `Bearer ${process.env.REMAX_APP_API_TOKEN}`;

const persistor = getPersistor();

const App: React.FC = (props) => {
  console.log(process.env.REMAX_APP_BASE_URL, process.env.REMAX_APP_ENVID);
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
