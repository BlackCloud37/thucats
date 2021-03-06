import * as React from 'react';
import { View } from '@remax/wechat';
import classNames from 'classnames';

export const Tabs = (props: { children: any; className?: string }) => {
  const tabClass = classNames('flex flex-col rounded-lg h-full overflow-hidden', props?.className);
  if (React.Children.count(props.children) === 0) {
    return null;
  }
  if (React.Children.count(props.children) === 1) {
    const { children } = props;
    if (!children) {
      return null;
    }
    const tab = children.props.tab;
    return (
      <View className={tabClass}>
        <View className="flex flex-row flex-nowrap h-10 w-full flex-shrink-0">
          <View className="font-light text-sm flex-grow flex items-center justify-evenly rounded-lg bg-white">
            {tab}
          </View>
        </View>
        <View className="rounded-lg">{children}</View>
      </View>
    );
  }
  const { children: _children } = props;
  const children = _children.filter((c: any) => !!c) as React.ReactElement[];
  const tabs = React.Children.map(children, (el) => el.props.tab);
  const [activeTab, setTab] = React.useState(tabs[0]);
  const tabCount = tabs.length;
  const activeTabIdx = tabs.findIndex((t) => t === activeTab) ?? 0;
  const activeTabEl = children[activeTabIdx];
  return (
    <View className={tabClass}>
      <View className="flex flex-row flex-nowrap h-10 w-full flex-shrink-0 bg-white">
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

export const TabPanel = (props: { children: any; tab: string; className?: string }) => {
  const { children, className } = props;
  return <View className={className}>{children}</View>;
};
