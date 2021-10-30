import * as React from 'react';
import { View, Image, Text } from 'remax/wechat';
import LLoading from 'lin-ui/dist/loading';

const Loadable = ({
  children,
  loading,
  loader = 'text'
}: {
  children: any;
  loading: boolean;
  loader?: 'running-cat' | 'text';
}) => {
  if (loading) {
    let loaderComp;
    switch (loader) {
      case 'text': {
        loaderComp = <View>Loading</View>;
        break;
      }
      case 'running-cat': {
        loaderComp = (
          <LLoading custom={true} show={true} l-class="flex flex-col items-center">
            <Image src="/images/running-cat.gif" className="w-20" mode="widthFix" />
            <Text className="block text-center font-light text-base text-gray-500">加载中</Text>
          </LLoading>
        );
        break;
      }
    }
    return loaderComp;
  }
  return children;
};
export default Loadable;
