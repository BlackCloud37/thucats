import { Cat } from '@/models/cats';
import { Dispatch, RootState } from '@/models/store';
import { navigateTo } from '@/utils';
import { Text, View } from '@remax/wechat';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { default as _l } from 'lodash';
import Loadable from '@/components/loadable';
import LInput from 'lin-ui/dist/input';
import TabBar from '@/components/tabbar';
import LAvatar from 'lin-ui/dist/avatar';

const FilterItem = ({ fieldName, filterCallback }: { fieldName: string; filterCallback: any }) => {
  return (
    <View className="flex flex-col items-center" onClick={filterCallback}>
      <View className="w-12 h-12 rounded-lg bg-blue-200  shadow-lg" />
      <View className="text-center text-sm font-light">
        <Text>{fieldName}</Text>
      </View>
    </View>
  );
};

const CatItem = ({ cat }: { cat: Cat }) => {
  const { name, sex, colorCategory, _avatar } = cat;
  return (
    <View
      className="flex h-20 bg-white shadow-lg rounded-lg mb-5 p-5"
      onClick={() => navigateTo('cat-profile', { catKey: cat._id })}
    >
      <LAvatar size={160} src={_avatar ?? '/images/default-cat.jpg'} shape="square" />
      <View className="pl-5 flex flex-col justify-between">
        <Text className="block text-black">{name}</Text>
        <View>
          <Text className="block text-gray-400">{sex}</Text>
          <Text className="block text-gray-400">{colorCategory}</Text>
          {/* {notice && <Text className="block bg-pink-400">{notice}</Text>} */}
        </View>
      </View>
    </View>
  );
};

const CatListPage = () => {
  const [selectedCats, setSelectedCats] = React.useState<Cat[]>([]);
  const { allCats, loading } = useSelector((state: RootState) => ({
    allCats: state.cats.allCats,
    loading: state.loading.effects.cats.fetchAllCatsAsync
  }));
  const { fetchAllCatsAsync } = useDispatch<Dispatch>().cats;
  const allCatsList = _l.values(allCats);

  React.useEffect(() => {
    fetchAllCatsAsync()
      .then(() => {
        setSelectedCats(allCatsList);
      })
      .catch(console.error);
  }, []);

  const catList =
    _l.size(selectedCats) > 0 ? (
      selectedCats.map((cat: Cat) => <CatItem key={cat._id} cat={cat} />)
    ) : (
      <Text className="block w-full text-sm font-light text-gray-500 text-center">
        这里似乎没有猫咪
      </Text>
    );

  const filter = _l.curry(
    (k: string, v: string) => () =>
      setSelectedCats(_l.filter(allCatsList, (c) => c[k as keyof Cat] === v))
  );
  const filterByColorCategory = filter('colorCategory');
  // const filterByStatus = filter('status');
  return (
    <>
      <View className="p-5 pb-20">
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
          l-class="text-center mb-5 rounded-lg bg-gray-200 opacity-90 font-semibold text-lg shadow-lg"
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

  // {loading ? <View>Loading</View> : <View></View>};
};

export default CatListPage;
