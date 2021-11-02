import * as React from 'react';
import { View } from '@remax/wechat';
import Photo from '@/components/photo';
import { Tabs, TabPanel } from '@/components/tabs';
import { navigateTo } from '@/utils';
import { usePageEvent } from '@remax/macro';

const SciencePopularizingPage = () => {
  usePageEvent('onShareAppMessage', () => ({
    title: '科普栏目',
    path: '/pages/science-popularizing/index'
  }));
  return (
    <View className="p-5">
      <Tabs>
        <TabPanel tab="喂食">
          <View className="text-sm text-gray-500 font-light p-2 leading-relaxed">
            <View
              className="flex flex-col mb-4"
              onClick={() =>
                navigateTo('webview', { link: 'https://mp.weixin.qq.com/s/UkWeB6YkcYDUn-VTlhEu0A' })
              }
            >
              <Photo src="cloud://thucats-3grq39dr7a44e550.7468-thucats-3grq39dr7a44e550-1307824186/cloudbase-cms/upload/2021-11-01/pfrxo0lvxdqusks3hy047xtmkdbei2t8_.jpg" />
              <View className="text-right w-full text-xs text-black font-light">
                点击查看相关推送
              </View>
            </View>

            <View className="mb-4">
              这是一篇科普文章，文章的第一段落介绍了这篇文章的概要：它充斥着无意义的字眼，只为了满足展示所需的字数要求。
            </View>
            <View className="mb-4">
              剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容。
            </View>
            <View className="mb-4">
              这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容。
            </View>
            <View className="mb-4">
              最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾。
            </View>
            <View className="mb-4 w-full text-right">作者：佚名</View>
          </View>
        </TabPanel>
        <TabPanel tab="疾病">
          <View className="text-sm text-gray-500 font-light p-2 leading-relaxed">
            <View className="mb-4">
              这是一篇科普文章，文章的第一段落介绍了这篇文章的概要：它充斥着无意义的字眼，只为了满足展示所需的字数要求。
            </View>
            <View
              className="flex flex-col mb-4"
              onClick={() =>
                navigateTo('webview', { link: 'https://mp.weixin.qq.com/s/UkWeB6YkcYDUn-VTlhEu0A' })
              }
            >
              <Photo src="cloud://thucats-3grq39dr7a44e550.7468-thucats-3grq39dr7a44e550-1307824186/cloudbase-cms/upload/2021-11-01/pfrxo0lvxdqusks3hy047xtmkdbei2t8_.jpg" />
              <View className="text-right w-full text-xs text-black font-light">
                点击查看相关推送
              </View>
            </View>
            <View className="mb-4">
              剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容。
            </View>
            <View className="mb-4">
              这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容。
            </View>
            <View className="mb-4">
              最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾。
            </View>
            <View className="mb-4 w-full text-right">作者：佚名</View>
          </View>
        </TabPanel>
        <TabPanel tab="领养">
          <View className="text-sm text-gray-500 font-light p-2 leading-relaxed">
            <View className="mb-4">
              这是一篇科普文章，文章的第一段落介绍了这篇文章的概要：它充斥着无意义的字眼，只为了满足展示所需的字数要求。
            </View>
            <View className="mb-4">
              剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容。
            </View>
            <View
              className="flex flex-col mb-4"
              onClick={() =>
                navigateTo('webview', { link: 'https://mp.weixin.qq.com/s/UkWeB6YkcYDUn-VTlhEu0A' })
              }
            >
              <Photo src="cloud://thucats-3grq39dr7a44e550.7468-thucats-3grq39dr7a44e550-1307824186/cloudbase-cms/upload/2021-11-01/pfrxo0lvxdqusks3hy047xtmkdbei2t8_.jpg" />
              <View className="text-right w-full text-xs text-black font-light">
                点击查看相关推送
              </View>
            </View>
            <View className="mb-4">
              这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容。
            </View>
            <View className="mb-4">
              最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾。
            </View>
            <View className="mb-4 w-full text-right">作者：佚名</View>
          </View>
        </TabPanel>
        <TabPanel tab="绝育">
          <View className="text-sm text-gray-500 font-light p-2 leading-relaxed">
            <View className="mb-4">
              这是一篇科普文章，文章的第一段落介绍了这篇文章的概要：它充斥着无意义的字眼，只为了满足展示所需的字数要求。
            </View>
            <View
              className="flex flex-col mb-4"
              onClick={() =>
                navigateTo('webview', { link: 'https://mp.weixin.qq.com/s/UkWeB6YkcYDUn-VTlhEu0A' })
              }
            >
              <Photo src="cloud://thucats-3grq39dr7a44e550.7468-thucats-3grq39dr7a44e550-1307824186/cloudbase-cms/upload/2021-11-01/pfrxo0lvxdqusks3hy047xtmkdbei2t8_.jpg" />
              <View className="text-right w-full text-xs text-black font-light">
                点击查看相关推送
              </View>
            </View>
            <View className="mb-4">
              剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容。
            </View>
            <View className="mb-4">
              这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容。
            </View>
            <View className="mb-4">
              最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾。
            </View>
            <View className="mb-4 w-full text-right">作者：佚名</View>
          </View>
        </TabPanel>
        <TabPanel tab="撸猫">
          <View className="text-sm text-gray-500 font-light p-2 leading-relaxed">
            <View className="mb-4">
              这是一篇科普文章，文章的第一段落介绍了这篇文章的概要：它充斥着无意义的字眼，只为了满足展示所需的字数要求。
            </View>
            <View className="mb-4">
              剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容，剩下的都是一些复制粘贴的内容。
            </View>
            <View className="mb-4">
              这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容，这里也是一些复制粘贴的内容。
            </View>
            <View className="mb-4">
              最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾，最后用一段复制粘贴的内容收尾。
            </View>
            <View
              className="flex flex-col mb-4"
              onClick={() =>
                navigateTo('webview', { link: 'https://mp.weixin.qq.com/s/UkWeB6YkcYDUn-VTlhEu0A' })
              }
            >
              <Photo src="cloud://thucats-3grq39dr7a44e550.7468-thucats-3grq39dr7a44e550-1307824186/cloudbase-cms/upload/2021-11-01/pfrxo0lvxdqusks3hy047xtmkdbei2t8_.jpg" />
              <View className="text-right w-full text-xs text-black font-light">
                点击查看相关推送
              </View>
            </View>
            <View className="mb-4 w-full text-right">作者：佚名</View>
          </View>
        </TabPanel>
      </Tabs>
    </View>
  );
};

export default SciencePopularizingPage;
