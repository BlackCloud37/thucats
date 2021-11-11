import { Cat } from '@/models/cats';
import { Dispatch, RootState } from '@/models/store';
import { Text, View } from '@remax/wechat';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { default as _l } from 'lodash';
import Loadable from '@/components/loadable';
import LInput from 'lin-ui/dist/input';
import TabBar from '@/components/tabbar';
import { usePageEvent } from '@remax/macro';

import CatItem from './components/cat-item';

const FilterItem = ({ fieldName, filterCallback }: { fieldName: string; filterCallback: any }) => {
  return (
    <View className="flex flex-col items-center" onClick={filterCallback}>
      <View className="w-12 h-12 rounded-lg bg-blue-200" />
      <View className="text-center text-sm font-light">
        <Text>{fieldName}</Text>
      </View>
    </View>
  );
};

const CatListPage = () => {
  usePageEvent('onShareAppMessage', () => ({
    title: '猫咪图鉴',
    path: '/pages/cat-list/index'
  }));

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
    setSelectedCats(allCatsList);
  }, [allCatsList]);

  const catList =
    _l.size(selectedCats) > 0 ? (
      selectedCats.map((cat: Cat) => <CatItem key={cat._id} cat={cat} />)
    ) : (
      <Text className="block w-full text-sm font-light text-gray-500 text-center">
        这里似乎没有猫咪
      </Text>
    );

  const filter = _l.curry(
    (k: keyof Cat, v: string) => () => setSelectedCats(_l.filter(allCatsList, (c) => c[k] === v))
  );
  const filterByColorCategory = filter('colorCategory');
  return (
    <>
      <View className="p-5 font-light">
        <LInput
          hide-label={true}
          placeholder="搜索"
          clear={true}
          bindlininput={_l.throttle(({ detail: { value } }) => {
            value
              ? setSelectedCats(_l.filter(allCatsList, (cat) => cat.name.includes(value)))
              : setSelectedCats(allCatsList);
          }, 500)}
          bindlinclear={() => {
            setSelectedCats(allCatsList);
          }}
          l-class="text-center mb-5 rounded-lg bg-gray-400 bg-opacity-20 font-semibold text-lg shadow-inner"
          l-row-class="hidden"
        />
        <View className="flex flex-nowrap gap-4 overflow-scroll mb-5">
          <FilterItem fieldName="所有" filterCallback={() => setSelectedCats(allCatsList)} />
          <FilterItem fieldName="纯黑" filterCallback={filterByColorCategory('纯黑')} />
          <FilterItem fieldName="纯白" filterCallback={filterByColorCategory('纯白')} />
          <FilterItem fieldName="狸花" filterCallback={filterByColorCategory('狸花')} />
          <FilterItem fieldName="奶牛" filterCallback={filterByColorCategory('奶牛')} />
          <FilterItem fieldName="橘猫" filterCallback={filterByColorCategory('橘猫与橘白')} />
          <FilterItem fieldName="三花" filterCallback={filterByColorCategory('三花')} />
          <FilterItem fieldName="玳瑁" filterCallback={filterByColorCategory('玳瑁')} />
        </View>
        <Loadable loading={loading} loader="running-cat">
          {catList}
        </Loadable>
      </View>
      <TabBar />
    </>
  );
};

export default CatListPage;
