import { Cat } from '@/models/cats';
import { RootState } from '@/models/store';
import { usePageEvent } from '@remax/framework-shared';
import { Text, View } from '@remax/wechat';
import * as React from 'react';
import { useSelector } from 'react-redux';

export interface CatProfilePayload {
  catKey: string;
}

const CatProfilePage = () => {
  const [cat, setCat] = React.useState<Cat>();
  // TODO: 没有这只猫的场景
  const { allCats } = useSelector((state: RootState) => ({
    allCats: state.cats.allCats
  }));
  usePageEvent('onLoad', ({ payload }) => {
    const { catKey } = JSON.parse(payload) as CatProfilePayload;
    console.log(allCats.get(catKey));
    setCat(allCats.get(catKey));
  });

  return cat ? (
    <View>
      <View>
        <Text>名字：</Text>
        <Text>{cat.name}</Text>
      </View>
      <View>
        <Text>性别：</Text>
        <Text>{cat.sex}</Text>
      </View>
      <View>
        <Text>毛色：</Text>
        <Text>{cat.colorCategory}</Text>
      </View>
    </View>
  ) : (
    <View>Loading</View>
  );
};

export default CatProfilePage;
