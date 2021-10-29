import * as React from 'react';
import LTabBar from 'lin-ui/dist/tab-bar';
import config from '@/app.config';

// TabBar的样式被全局覆盖，见app.css
const TabBar = () => {
  // add prefix `/`
  let list = (config.tabBar?.list ?? []).map((x) => {
    return { ...x, pagePath: '/' + x.pagePath };
  });
  return <LTabBar list={list} text-selected-color="#5d4aff" />;
};
export default TabBar;
