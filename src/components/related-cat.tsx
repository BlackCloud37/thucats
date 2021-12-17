import { Text, View } from '@remax/wechat';
import * as React from 'react';
import { navigateTo } from '@/utils';
import { DbCat } from '@/typings/db';
import Avatar from '@/components/avatar';

const RelatedCatItem = ({ cat, desc }: { cat: DbCat; desc?: string }) => {
  return (
    <View
      className="flex mt-2 w-full"
      onClick={() => navigateTo('cat-profile', { catKey: cat._id })}
    >
      <Avatar src={cat._avatar} className="w-12 h-12 rounded-full" />
      <View className="flex-col pl-2">
        <Text className="block w-full text-xs font-normal">{cat.name}</Text>
        <Text className="block w-full text-xs font-light">{desc}</Text>
      </View>
    </View>
  );
};

export default RelatedCatItem;
