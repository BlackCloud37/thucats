import classNames from 'classnames';
import * as React from 'react';
import { Image } from 'remax/wechat';

const Photo = ({ src, grey = false }: { src: string | undefined; grey?: boolean }) => {
  return src ? (
    <Image
      lazyLoad
      webp
      showMenuByLongpress
      src={src}
      mode="widthFix"
      className={classNames('w-full rounded-xl mt-2 shadow-xl', grey && 'grayscale')}
    />
  ) : null;
};

export default Photo;
