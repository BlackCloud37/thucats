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

// const filters: { key: 'colorCategory'; val: string }[] = [
//   {
//     key: 'colorCategory',
//     val: '纯黑'
//   },
//   {
//     key: 'colorCategory',
//     val: '纯白'
//   },
//   {
//     key: 'colorCategory',
//     val: '狸花'
//   },
//   {
//     key: 'colorCategory',
//     val: '奶牛'
//   },
//   {
//     key: 'colorCategory',
//     val: '橘猫与橘白'
//   },
//   {
//     key: 'colorCategory',
//     val: '三花'
//   },
//   {
//     key: 'colorCategory',
//     val: '玳瑁'
//   }
// ];

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

  React.useEffect(() => {
    fetchAllCatsAsync()
      .then(() => {
        setSelectedCats(_l.values(allCats));
      })
      .catch(console.error);
  }, []);

  const catList = selectedCats.map((cat: Cat) => <CatItem key={cat._id} cat={cat} />);

  return (
    <>
      <Loadable loading={loading}>
        <View className="p-5">
          <LInput
            hide-label={true}
            placeholder="搜索"
            clear={true}
            bindlininput={_l.throttle(({ detail: { value } }) => {
              value
                ? setSelectedCats(_l.filter(_l.values(allCats), (cat) => cat.name.includes(value)))
                : setSelectedCats(_l.values(allCats));
            }, 500)}
            bindlinclear={() => {
              setSelectedCats(_l.values(allCats));
            }}
            l-class="text-center mb-5 rounded-lg bg-gray-200 opacity-90 font-semibold text-lg shadow-lg"
            l-row-class="hidden"
          />
          {/* <View className="flex flex-row mb-5">
            <View
              className="w-10 h-10 rounded-xl bg-gray-600"
              onClick={() => setSelectedCats(_l.values(allCats))}
            >
              全部
            </View>
            {filters.map(({ key, val }) => (
              <View
                key={val}
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: 'white',
                  margin: '10px'
                }}
                onClick={() => {
                  setSelectedCats(_l.filter(_l.values(allCats), (cat) => cat[key] === val));
                }}
              >
                {val}
              </View>
            ))}
          </View> */}
          {catList}
        </View>
      </Loadable>
      <TabBar />
    </>
  );

  // {loading ? <View>Loading</View> : <View></View>};
};

export default CatListPage;
