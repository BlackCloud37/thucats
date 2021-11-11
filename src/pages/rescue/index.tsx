import { TabPanel, Tabs } from '@/components/tabs';
import { showToast, View } from '@remax/wechat';
import * as React from 'react';

const RescuePage = () => {
  return (
    <View className="p-5">
      <Tabs>
        <TabPanel tab="猫/狗">
          <View className="text-sm font-light p-5">
            <View className="mb-4">给出一些状况选项及相应的紧急处理措施</View>
            <View className="mb-4">所处地点是: A. 校内 B. 校外</View>
            <View className="mb-4">救助类型是: A. 患病 B. 受伤</View>
            <View className="mb-4">受伤动物状态是: A. 有生命体征 B. 无生命体征</View>
            <View className="mb-4">...</View>
            <View className="mb-4">...</View>
            <View className="mb-4">如果发生在校内，且满足某些条件，可以向我们发起救助申请</View>
            <View className="mb-4">这是一个救助申请表单</View>
            <View className="mb-4">
              <View>动物类型：___</View>
              <View>联系方式：___</View>
              <View>...：___</View>
              <View
                className="bg-blue-200 p-5 text-center rounded-lg"
                onClick={() =>
                  showToast({
                    title: '提交成功'
                  })
                }
              >
                提交表单
              </View>
            </View>
          </View>
        </TabPanel>
        <TabPanel tab="鸟类">
          <View className="text-sm font-light p-5">
            <View className="mb-4">给出一些关于鸟类救助的建议</View>
            <View className="mb-4">...</View>
            <View className="mb-4">...</View>
            <View className="mb-4">...</View>
            <View className="mb-4">...</View>
            <View className="mb-4">...</View>
            <View className="mb-4">...</View>
          </View>
        </TabPanel>
        <TabPanel tab="其他">{}</TabPanel>
      </Tabs>
    </View>
  );
};

export default RescuePage;
