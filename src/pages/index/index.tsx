import * as React from 'react';
import { View, Text, Image } from 'remax/wechat';
import { usePageEvent } from '@remax/macro';
import { navigateTo } from '@/utils';
import TabBar from '@/components/tabbar';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/models/store';
import Loadable from '@/components/loadable';

const Index = () => {
  const { associationName, associationIcon, slogan, loading } = useSelector((state: RootState) => ({
    ...state.settings,
    loading: state.loading.effects.settings.fetchSettingsAsync
  }));

  usePageEvent('onShareAppMessage', () => ({
    title: '猫咪图鉴',
    path: '/pages/index/index'
  }));

  const { fetchSettingsAsync } = useDispatch<Dispatch>().settings;

  React.useEffect(() => {
    fetchSettingsAsync().catch(console.error);
  }, []);

  return (
    <>
      <Loadable loading={loading} loader="running-cat">
        <View className="p-5">
          {/* 头部 */}
          <View className="flex flex-col items-start ml-3 mt-8 mb-12">
            {associationIcon && (
              <Image webp src={associationIcon} mode="widthFix" className="w-20 mb-6" />
            )}
            <Text className="text-lg block text-black font-semibold mb-1dot5">
              {associationName}
            </Text>
            <Text className="text-xs block text-left text-gray-400">{slogan}</Text>
          </View>
          {/* 双列目录 */}
          <View className="flex flex-row w-full justify-evenly text-2xl text-white font-medium font tracking-widest">
            <View className="w-1on2 mr-5">
              <View
                style={{ backgroundImage: 'linear-gradient(135deg, #FF8000 0%, #FFCF00 100%)' }}
                className="bg-gray-300 h-32 w-full mb-5 rounded-lg relative shadow-lg"
                onClick={() => navigateTo('cat-list')}
              >
                <View className="pr-4 pt-4">
                  <Text className="block text-right">猫咪</Text>
                  <Text className="block text-right">图鉴</Text>
                </View>
                <Image src="/images/cat-1.svg" className="w-28 h-28 absolute -left-2 -bottom-8" />
              </View>
              <View
                style={{ backgroundImage: 'linear-gradient(135deg, #1BCF7D 0%, #9CFF75 100%)' }}
                className="h-40 w-full rounded-lg relative shadow-lg"
                onClick={() => navigateTo('about')}
              >
                <View className="pl-4 pt-4">
                  <Text className="block text-left">关于</Text>
                  <Text className="block text-left">我们</Text>
                </View>
                <Image
                  src="/images/cat-3.svg"
                  className="w-36 h-32 absolute -right-14 -bottom-6 z-10"
                />
              </View>
            </View>
            <View className="w-1on2">
              <View
                style={{ backgroundImage: 'linear-gradient(135deg, #4F01FD 0%, #B401FD 100%)' }}
                className="h-40 w-full mb-5 rounded-lg relative shadow-lg"
                onClick={() => navigateTo('science-popularizing')}
              >
                <View className="pl-4 pt-4">
                  <Text className="block text-left">科普</Text>
                  <Text className="block text-left">栏目</Text>
                </View>
                <Image src="/images/cat-2.svg" className="w-28 h-28 absolute -right-6 -bottom-2" />
              </View>
              <View
                style={{ backgroundImage: 'linear-gradient(135deg, #00BDFF 0%, #00FFD1 100%)' }}
                className="h-36 w-full rounded-lg relative shadow-lg"
                onClick={() => navigateTo('adopt')}
              >
                <View className="pl-4 pt-4">
                  <Text className="block text-left">猫咪</Text>
                  <Text className="block text-left">领养</Text>
                </View>
                <Image
                  src="/images/cat-4.svg"
                  className="w-28 h-28 absolute -right-6 -bottom-6 z-0"
                />
              </View>
            </View>
          </View>
        </View>
      </Loadable>
      <TabBar />
    </>
  );
};

export default Index;
