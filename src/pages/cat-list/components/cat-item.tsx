import { navigateTo } from '@/utils';
import { Text, View } from '@remax/wechat';
import * as React from 'react';
import classNames from 'classnames';
import Clipable from '@/components/clipable';
import { ApiCat } from '@/typings/interfaces';
import Avatar from '@/components/avatar';
const Tag = ({ tag, className = 'bg-gray-200' }: { tag: string; className?: string }) => {
  return tag !== '未知' ? (
    <View className={`rounded-md p-1 shadow-inner text-xs ${className}`}>{tag}</View>
  ) : null;
};

export default ({
  cat,
  adopt = false,
  className
}: {
  cat: ApiCat;
  adopt?: boolean;
  className?: string;
}) => {
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
      className={classNames('flex-col bg-white shadow-lg rounded-lg p-5', className)}
      onClick={() => navigateTo('cat-profile', { catKey: cat._id })}
    >
      <View className="flex h-20">
        <Avatar src={_avatar} className="h-20 w-20 rounded-lg" />
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
              <Clipable clipContent={adoptContact}>
                <Text className="text-blue-500 underline">{adoptContact}</Text>
              </Clipable>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};
