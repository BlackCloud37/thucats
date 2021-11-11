import * as React from 'react';
import { Image } from 'remax/wechat';

const Photo = ({ src }: { src: string | undefined }) => {
  return src ? (
    <Image webp src={src} mode="widthFix" className="w-full rounded-xl mt-2 shadow-xl" />
  ) : null;
};

export default Photo;
