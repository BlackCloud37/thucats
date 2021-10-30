import { ComponentType } from 'react';

declare const LAvatar: ComponentType<{
  size?: number,
  src: string,
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
  shape?: 'square' | 'circle'
}>;
export default LAvatar;