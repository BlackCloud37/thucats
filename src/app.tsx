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

// TODO: config
// @ts-ignore
wxRequest.defaults.baseURL =
  'https://thucats-3grq39dr7a44e550-1307824186.ap-shanghai.service.tcloudbase.com/api/v1.0';
// @ts-ignore
wxRequest.defaults.headers.post['Content-Type'] = 'application/json';

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
