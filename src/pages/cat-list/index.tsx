import { Cat } from '@/models/cats';
import { Dispatch, RootState } from '@/models/store';
import { navigateTo } from '@/utils';
import { Image, Text, View } from '@remax/wechat';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CatItem = ({ cat }: { cat: Cat }) => {
  const { name, sex, colorCategory, _avatar } = cat;
  return (
    <View
      style={{ backgroundColor: 'gray', margin: '10px 0', flexDirection: 'row' }}
      onClick={() => navigateTo('cat-profile', { catKey: cat._id })}
    >
      <Image
        style={{ width: 200, height: 200, borderRadius: 100 }}
        mode="widthFix"
        lazyLoad={true}
        src={_avatar ?? '/default-cat.jpg'}
      />
      <Text>{name} | </Text>
      <Text>{sex} | </Text>
      <Text>{colorCategory}</Text>
    </View>
  );
};

const CatListPage = () => {
  const { allCats, loading } = useSelector((state: RootState) => ({
    allCats: state.cats.allCats,
    loading: state.loading.effects.cats.fetchAllCatsAsync
  }));
  const { fetchAllCatsAsync } = useDispatch<Dispatch>().cats;

  React.useEffect(() => {
    fetchAllCatsAsync().catch(console.error);
  }, []);

  const catList = Array.from(allCats.values()).map((cat: Cat) => (
    <CatItem key={cat._id} cat={cat} />
  ));
  return <View>{loading ? <View>Loading</View> : catList}</View>;
};

export default CatListPage;
