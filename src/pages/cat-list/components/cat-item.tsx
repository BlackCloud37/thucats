import { Cat } from '@/models/cats';
import { navigateTo } from '@/utils';
import { Text, View } from '@remax/wechat';
import * as React from 'react';
import classNames from 'classnames';
import LAvatar from 'lin-ui/dist/avatar';

export default ({ cat }: { cat: Cat }) => {
  const { name, _avatar, noticeLevel, noticeAbstract } = cat;
  return (
    <View
      className="flex h-20 bg-white shadow-lg rounded-lg mb-5 p-5"
      onClick={() => navigateTo('cat-profile', { catKey: cat._id })}
    >
      <LAvatar size={160} src={_avatar ?? '/images/default-cat.jpg'} shape="square" />
      <View className="pl-5 flex flex-col justify-between">
        <Text className="text-black text-lg">{name}</Text>
        <View className="flex flex-col justify-around text-xs text-gray-500">
          {noticeLevel && noticeAbstract && (
            <View
              className={classNames('rounded-md p-1 shadow-inner', {
                'bg-red-200': noticeLevel === '高',
                'bg-yellow-200': noticeLevel === '中',
                'bg-blue-200': noticeLevel === '低'
              })}
            >
              {noticeAbstract}
            </View>
          )}
          {/* <View className="rounded-lg p-1 relative">
              <View
                className={classNames('absolute left-0 top-0 w-1 h-full rounded-l-lg', {
                  'bg-red-200': noticeLevel === '高',
                  'bg-yellow-200': noticeLevel === '中',
                  'bg-blue-200': noticeLevel === '低'
                })}
              />
              {noticeAbstract}
            </View> */}
        </View>
      </View>
    </View>
  );
};
