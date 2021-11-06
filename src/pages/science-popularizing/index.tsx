import * as React from 'react';
import { View } from '@remax/wechat';
// import Photo from '@/components/photo';
import { Tabs, TabPanel } from '@/components/tabs';
// import { navigateTo } from '@/utils';
import { usePageEvent } from '@remax/macro';
import Wemark from '@/components/wemark/wemark';
import articles from './articles';

const SciencePopularizingPage = () => {
  usePageEvent('onShareAppMessage', () => ({
    title: '科普栏目',
    path: '/pages/science-popularizing/index'
  }));
  return (
    <View className="p-5">
      <Tabs>
        {articles.map(({ tab, content, author }) => (
          <TabPanel key="title" tab={tab}>
            <View className="text-sm text-gray-500 font-light p-4 leading-relaxed">
              <Wemark md={content} />
              <View className="mb-4 w-full text-right">{author}</View>
            </View>
          </TabPanel>
        ))}
      </Tabs>
    </View>
  );
};

export default SciencePopularizingPage;
