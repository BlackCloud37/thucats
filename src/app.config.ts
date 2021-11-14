import { AppConfig } from 'remax/wechat';

const config: AppConfig = {
  pages: [
    'pages/index/index',
    'pages/cat-list/index',
    'pages/404/index',
    'pages/cat-profile/index',
    'pages/science-popularizing/index',
    'pages/webview/index',
    'pages/about/index',
    'pages/rescue/index',
    'pages/adopt/index',
    'pages/profile/index'
  ],
  window: {
    navigationBarTitleText: '猫咪图鉴',
    navigationBarBackgroundColor: '#f9f9f9',
    navigationBarTextStyle: 'black'
  },

  tabBar: {
    custom: true,
    color: 'white',
    selectedColor: '#5d4aff',
    backgroundColor: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '主页',
        iconPath: '/images/tab-bar-icons/tx-zhengfangxing.png',
        selectedIconPath: '/images/tab-bar-icons/tx-zhengfangxing-selected.png'
      },
      {
        pagePath: 'pages/cat-list/index',
        text: '猫咪图鉴',
        iconPath: '/images/tab-bar-icons/tx-sanjiaoxing.png',
        selectedIconPath: '/images/tab-bar-icons/tx-sanjiaoxing-selected.png'
      },
      {
        pagePath: 'pages/about/index',
        text: '关于我们',
        iconPath: '/images/tab-bar-icons/tx-yuanxing.png',
        selectedIconPath: '/images/tab-bar-icons/tx-yuanxing-selected.png'
      }
    ]
  },
  navigateToMiniProgramAppIdList: ['wxebadf544ddae62cb']
};

export default config;
