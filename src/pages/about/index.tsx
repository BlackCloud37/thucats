import TabBar from '@/components/tabbar';
import { RootState } from '@/models/store';
import { Text, View, Image, setClipboardData, showToast } from '@remax/wechat';
import * as React from 'react';
import { useSelector } from 'react-redux';
import Wemark from '@/components/wemark/wemark';

const About = () => {
  const { associationLogo, associationIntroduction } = useSelector((state: RootState) => ({
    ...state.settings,
    loading: state.loading.effects.settings.fetchSettingsAsync
  }));

  return (
    <>
      <View className="m-5 p-5 bg-white rounded-lg shadow-xl flex flex-col items-start font-light text-sm">
        <Image src={associationLogo} mode="widthFix" className="w-2on3 mb-5 self-center" />
        <Wemark md={associationIntroduction} />
        <Text
          className="block mb-5 w-full text-center"
          onClick={() => {
            setClipboardData({
              data: 'https://github.com/BlackCloud37/thucats/wiki/部署流程',
              success: () => {
                showToast({
                  title: '网址已复制'
                });
              }
            });
          }}
        >
          一键部署教程已经发布在<Text className="underline text-blue-500">Github</Text>，欢迎体验
        </Text>
      </View>
      <TabBar />
    </>
  );
};

export default About;
