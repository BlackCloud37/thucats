import { previewImage, View, Image } from '@remax/wechat';
import * as React from 'react';
import './album.css';

// about `pad-item`, see https://www.zhangxinxu.com/wordpress/2019/08/css-flex-last-align/
const Album = (props: { urls: string[] }) => {
  const { urls } = props;
  return (
    <View className="flex flex-wrap justify-evenly p-2 w-full">
      {urls.map((url) => (
        <Image
          key={url}
          lazyLoad
          webp
          showMenuByLongpress
          onTap={() => {
            previewImage({
              urls,
              current: url
            });
          }}
          src={url}
          mode="aspectFill"
          className="w-20 h-20 mb-2"
        />
      ))}
      <View className="pad-item" />
      <View className="pad-item" />
      <View className="pad-item" />
      <View className="pad-item" />
      <View className="pad-item" />
      <View className="pad-item" />
    </View>
  );
};

export default Album;
