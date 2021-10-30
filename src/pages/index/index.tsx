import * as React from 'react';
import { View, Text, Image } from 'remax/wechat';
import { navigateTo } from '@/utils';
import TabBar from '@/components/tabbar';

const Index = () => {
  // const { openid, loading } = useSelector((state: RootState) => ({
  // openid: state.users.openid,
  // loading: state.loading.effects.users.fetchOpenidAsync // true when `fetchOpenidAsync` is running
  // }));
  // const dispatch = useDispatch<Dispatch>();
  // const { fetchOpenidAsync } = dispatch.users;

  return (
    <View className="p-5 pb-36">
      {/* 头部 */}
      <View className="flex flex-col items-start ml-8 mt-8 mb-12">
        <Image src="/images/logo.png" mode="widthFix" className="w-20 mb-6" />
        <Text className="text-lg block text-black font-semibold mb-1dot5">
          清华大学学生小动物保护协会
        </Text>
        <Text className="text-xs block text-left text-gray-400">
          愿你我成为内心柔软，行动有力的人
        </Text>
      </View>
      {/* 双列目录 */}
      <View className="flex flex-row w-full justify-evenly text-2xl text-white font-medium font tracking-widest">
        <View className="w-1on2 mr-5">
          <View
            style={{ backgroundImage: 'linear-gradient(135deg, #FF8000 0%, #FFCF00 100%)' }}
            className="bg-blue-100 h-32 w-full mb-5 rounded-lg relative shadow-lg"
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
            className="bg-blue-100 h-40 w-full rounded-lg relative shadow-lg"
            onClick={() => navigateTo('404')}
          >
            <View className="pl-4 pt-4">
              <Text className="block text-left">科普</Text>
              <Text className="block text-left">栏目</Text>
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
            className="bg-blue-100 h-40 w-full mb-5 rounded-lg relative shadow-lg"
            onClick={() => navigateTo('404')}
          >
            <View className="pl-4 pt-4">
              <Text className="block text-left">救助</Text>
              <Text className="block text-left">申请</Text>
            </View>
            <Image src="/images/cat-2.svg" className="w-28 h-28 absolute -right-6 -bottom-2" />
          </View>
          <View
            style={{ backgroundImage: 'linear-gradient(135deg, #00BDFF 0%, #00FFD1 100%)' }}
            className="bg-blue-100 h-36 w-full rounded-lg relative shadow-lg"
            onClick={() => navigateTo('404')}
          >
            <View className="pl-4 pt-4">
              <Text className="block text-left">猫咪</Text>
              <Text className="block text-left">领养</Text>
            </View>
            <Image src="/images/cat-4.svg" className="w-28 h-28 absolute -right-6 -bottom-6 z-0" />
          </View>
        </View>
      </View>
      <TabBar />
    </View>
  );
};

export default Index;
