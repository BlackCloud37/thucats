import { AppConfig } from 'remax/wechat';

const config: AppConfig = {
  pages: [
    'pages/index/index',
    'pages/404/index',
    'pages/cat-list/index',
    'pages/cat-profile/index',
    'pages/about/index'
  ],
  window: {
    navigationBarTitleText: 'THU CATS',
    navigationBarBackgroundColor: '#282c34'
  }
};

export default config;
