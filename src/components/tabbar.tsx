import * as React from 'react';
import LTabBar from 'lin-ui/dist/tab-bar';

const TabBar = () => {
  return (
    <LTabBar
      list={[
        {
          pagePath: '/pages/index/index',
          text: '首页',
          iconPath: '/icon.png',
          selectedIconPath: '/icon.png'
        },
        {
          pagePath: '/pages/cat-list/index',
          text: '图鉴',
          iconPath: '/icon.png',
          selectedIconPath: '/icon.png'
        },
        {
          pagePath: '/pages/about/index',
          text: '关于',
          iconPath: '/icon.png',
          selectedIconPath: '/icon.png'
        }
      ]}
    />
  );
};
export default TabBar;
