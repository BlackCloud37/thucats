import { Cat } from '@/models/cats';
import { navigateTo } from '@/utils';
import { Text, View } from '@remax/wechat';
import * as React from 'react';
import classNames from 'classnames';
import LAvatar from 'lin-ui/dist/avatar';

const Tag = ({ tag, className = 'bg-gray-200' }: { tag: string; className?: string }) => {
  return tag !== '未知' ? (
    <View className={`rounded-md p-1 shadow-inner text-xs ${className}`}>{tag}</View>
  ) : null;
};

export default ({ cat, adopt = false }: { cat: Cat; adopt?: boolean }) => {
  const {
    name,
    _avatar,
    noticeLevel,
    noticeAbstract,
    sex,
    status,
    colorCategory,
    adoptContact,
    adoptDescription
  } = cat;
  return (
    <View
      className="flex-col bg-white shadow-lg rounded-lg mb-5 p-5"
      onClick={() => navigateTo('cat-profile', { catKey: cat._id })}
    >
      <View className="flex h-20">
        <LAvatar size={160} src={_avatar ?? '/images/default-cat.jpg'} shape="square" />
        <View className="pl-5 flex flex-col">
          <Text className="text-black text-lg">{name}</Text>
          <View className="flex flex-col items-start text-xs text-gray-500 gap-2">
            <View className="flex flex-wrap gap-2">
              <Tag tag={sex} />
              <Tag tag={colorCategory} />
              <Tag tag={status} />
            </View>
            {noticeLevel && noticeAbstract && (
              <Tag
                tag={noticeAbstract}
                className={classNames({
                  'bg-red-200': noticeLevel === '高',
                  'bg-yellow-200': noticeLevel === '中',
                  'bg-blue-200': noticeLevel === '低'
                })}
              />
            )}
          </View>
        </View>
      </View>

      {adopt ? (
        <View className="mt-5 text-sm">
          {adoptDescription && (
            <View>
              <Text className="font-normal">领养简介: </Text>
              {adoptDescription}
            </View>
          )}
          {adoptContact && (
            <View>
              <Text className="font-normal">领养联系: </Text>
              <Text className="text-blue-500 underline">{adoptContact}</Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};
