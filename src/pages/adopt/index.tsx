import { Cat } from '@/models/cats';
import { Dispatch, RootState } from '@/models/store';
import { Text, View } from '@remax/wechat';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { default as _l } from 'lodash';
import Loadable from '@/components/loadable';
import CatItem from '@/pages/cat-list/components/cat-item';

const AdoptPage = () => {
  const [selectedCats, setSelectedCats] = React.useState<Cat[]>([]);
  const { allCatsList, loading } = useSelector((state: RootState) => ({
    allCatsList: state.cats.allCatsList,
    loading: state.loading.effects.cats.fetchAllCatsAsync
  }));
  const { fetchAllCatsAsync } = useDispatch<Dispatch>().cats;

  React.useEffect(() => {
    fetchAllCatsAsync().catch(console.error);
  }, []);
  React.useEffect(() => {
    setSelectedCats(_l.filter(allCatsList, (c) => c['status'] === '待领养'));
  }, [allCatsList]);

  const catList =
    _l.size(selectedCats) > 0 ? (
      selectedCats.map((cat: Cat) => <CatItem key={cat._id} cat={cat} adopt />)
    ) : (
      <Text className="block w-full text-sm font-light text-gray-500 text-center">
        目前没有待领养的猫咪
      </Text>
    );
  return (
    <View className="p-5 font-light">
      <Loadable loading={loading} loader="running-cat">
        {catList}
      </Loadable>
    </View>
  );
};

export default AdoptPage;
