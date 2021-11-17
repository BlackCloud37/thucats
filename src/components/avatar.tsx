import classNames from 'classnames';
import * as React from 'react';
import { View, Image } from 'remax/wechat';

const Avatar = ({ src, className = 'h-20 w-20' }: { src?: string; className?: string }) => {
  return (
    <View className={classNames(className, 'relative overflow-hidden flex-shrink-0')}>
      <Image
        webp
        lazyLoad
        src={src ?? '/images/default-cat.jpg'}
        mode="widthFix"
        className="w-full h-full"
      />
    </View>
  );
};

export default Avatar;
