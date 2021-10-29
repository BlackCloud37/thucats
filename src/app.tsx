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
    console.log('App: onLaunch');
    cloud.init({});
    // loadFontFace({
    //   family: 'YuanTi',
    //   source:
    //     'url(https://7468-thucats-3grq39dr7a44e550-1307824186.tcb.qcloud.la/resources/RoundedCN/ResourceHanRoundedCN-Regular.ttf?sign=b5268491cf24923b0888fbd098ddb8c4&t=1635525610)'
    // })
    //   .then(console.log)
    //   .catch(console.error);
  });
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{props.children}</PersistGate>
    </Provider>
  );
};
export default App;
