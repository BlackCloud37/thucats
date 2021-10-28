import Loadable from '@/components/loadable';
import { Cat } from '@/models/cats';
import { RootState } from '@/models/store';
import { navigateTo } from '@/utils';
import { usePageEvent } from '@remax/framework-shared';
import { Image, Text, View } from '@remax/wechat';
import * as React from 'react';
import { useSelector } from 'react-redux';

export interface CatProfilePayload {
  catKey: string;
}

const CatProfilePage = () => {
  const [cat, setCat] = React.useState<Cat>();
  // TODO: 兜底没有这只猫的场景
  const { allCats } = useSelector((state: RootState) => ({
    allCats: state.cats.allCats
  }));
  usePageEvent('onLoad', ({ payload }) => {
    const { catKey } = JSON.parse(payload) as CatProfilePayload;
    console.log(allCats[catKey]);
    setCat(allCats[catKey]);
  });

  return (
    <Loadable loading={!cat}>
      <View>
        <Text>名字：</Text>
        <Text>{cat?.name}</Text>
      </View>
      <View>
        <Text>性别：</Text>
        <Text>{cat?.sex}</Text>
      </View>
      <View>
        <Text>毛色：</Text>
        <Text>{cat?.colorCategory}</Text>
      </View>
      {cat?.relatedCats && <View>相关猫咪</View>}
      {cat?.relatedCats
        ?.map((related_id) => allCats[related_id])
        .map(
          (related_cat) =>
            related_cat && (
              <View
                onClick={() => {
                  navigateTo('cat-profile', { catKey: related_cat._id });
                }}
              >
                <Image
                  style={{ width: 200, height: 200 }}
                  mode="widthFix"
                  src={related_cat._avatar ?? '/default-cat.jpg'}
                />
                {related_cat.name}
              </View>
            )
        )}
      {cat?._photos?.map((src) => (
        <Image mode="widthFix" src={src} key={src} />
      ))}
    </Loadable>
  );
};

export default CatProfilePage;
