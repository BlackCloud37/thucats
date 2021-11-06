import * as React from 'react';
import { View } from '@remax/wechat';
import classNames from 'classnames';

export const Tabs = (props: { children: any }) => {
  const { children: _children } = props;
  const children = _children as React.ReactElement[];
  const tabs = React.Children.map(children, (el) => el.props.tab);
  const [activeTab, setTab] = React.useState(tabs[0]);
  const tabCount = tabs.length;
  const activeTabIdx = tabs.findIndex((t) => t === activeTab);
  const activeTabEl = children[activeTabIdx];
  return (
    <View className="flex flex-col rounded-lg shadow-xl h-full bg-white">
      <View className="flex flex-row flex-nowrap h-10 w-full flex-shrink-0">
        {tabs.map((tab, index) => (
          <View
            key={tab}
            onClick={() => setTab(tab)}
            className={classNames('font-light text-sm flex-grow flex items-center justify-evenly', {
              'bg-gray-200': activeTab !== tab,
              'rounded-lg': activeTab === tab,
              'rounded-tr-lg': index === tabCount - 1,
              'rounded-tl-lg': index === 0,
              'rounded-bl-lg': index === activeTabIdx + 1,
              'rounded-br-lg': index === activeTabIdx - 1
            })}
          >
            {tab}
          </View>
        ))}
      </View>
      <View className="rounded-lg">{activeTabEl}</View>
    </View>
  );
};

export const TabPanel = (props: { children: any; tab: string }) => {
  const { children } = props;
  return <View>{children}</View>;
};
