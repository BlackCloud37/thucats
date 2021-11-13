import * as React from 'react';
import { View, setClipboardData, showToast } from 'remax/wechat';

const Clipable = ({ clipContent, children }: { clipContent: string; children?: any }) => {
  return (
    <View
      className="inline-block"
      onClick={(e) => {
        setClipboardData({
          data: clipContent,
          success: () => {
            showToast({
              title: '复制成功',
              icon: 'success'
            });
          }
        });
        // @ts-ignore
        e.stopPropagation();
      }}
    >
      {children}
    </View>
  );
};

export default Clipable;
