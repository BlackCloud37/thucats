import { Text, View, Image } from '@remax/wechat';
import * as React from 'react';

const NotFoundPage = () => {
  return (
    <View className="m-5 p-5 bg-white rounded-lg shadow-xl flex flex-col items-start font-light text-sm">
      <Image src="/images/running-cat.gif" mode="widthFix" className="w-20" />
      <Text className="block text-gray-500">页面开发中</Text>
    </View>
  );
};

export default NotFoundPage;
