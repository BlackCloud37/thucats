import { AppConfig } from 'remax/wechat';

export const customTexts = {
  associationName: '清华大学学生小动物保护协会', // 主页Title
  slogan: '愿你我成为内心柔软，行动有力的人', // 主页副Title
  navigationBarTitleText: 'THU Cats' // 页面顶部标题
};

const config: AppConfig = {
  pages: [
    'pages/index/index',
    'pages/cat-list/index',
    'pages/404/index',
    'pages/cat-profile/index',
    'pages/science-popularizing/index',
    'pages/webview/index',
    'pages/about/index',
    'pages/rescue/index'
  ],
  window: {
    navigationBarTitleText: customTexts.navigationBarTitleText,
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
