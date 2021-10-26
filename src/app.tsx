import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from './models/store';
import { cloud } from 'remax/wechat';
import './app.css';
import { useAppEvent } from '@remax/framework-shared';

const App: React.FC = (props) => {
  useAppEvent('onLaunch', () => {
    console.log('App: onLaunch');
    cloud.init({});
  });
  return <Provider store={store}>{props.children}</Provider>;
};
export default App;
