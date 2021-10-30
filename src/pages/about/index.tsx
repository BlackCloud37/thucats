import TabBar from '@/components/tabbar';
import { Text, View, Navigator, Image, setClipboardData, showToast } from '@remax/wechat';
import * as React from 'react';

const About = () => {
  return (
    <>
      <View className="m-5 p-5 bg-white rounded-lg shadow-xl flex flex-col items-start font-light text-sm">
        <Image
          src="/images/full-logo-transparent.png"
          mode="widthFix"
          className="w-2on3 mb-5 self-center"
        />
        <Text className="block text-gray-500">新版小程序</Text>
        <Text className="block mb-5">
          目前新版小程序正在持续迭代中，会根据需求优先级持续上线功能，预计一周发布一版
        </Text>
        <Text className="block mb-5">
          在功能完善后，会将本项目开源，并提供尽量一键的部署方式，敬请期待
        </Text>
        <Text className="block text-gray-500">联系我们</Text>
        <Text
          className="block mb-2"
          onClick={() => {
            console.log('clicke');
            setClipboardData({
              data: 'yechenz37@163.com',
              success: () =>
                showToast({
                  title: '邮箱已复制到粘贴板'
                })
            });
          }}
        >
          提需求及Bug反馈，可以直接联系
          <Text className="underline text-blue-500">yechenz37@163.com</Text>
          或填写以下问卷
        </Text>
        <Navigator
          target="miniProgram"
          openType="navigate"
          appId="wxebadf544ddae62cb"
          path="pages/survey/index?sid=9239520&hash=6765"
          version="release"
        >
          <Text className="text-center underline text-blue-500">反馈问卷</Text>
        </Navigator>
      </View>
      <TabBar />
    </>
  );
};

export default About;
