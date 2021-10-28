import { Cat } from '@/models/cats';
import { Dispatch, RootState } from '@/models/store';
import { navigateTo } from '@/utils';
import { Image, Text, View } from '@remax/wechat';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { default as _l } from 'lodash';
import Loadable from '@/components/loadable';
import LInput from 'lin-ui/dist/input';

const filters: { key: 'colorCategory'; val: string }[] = [
  {
    key: 'colorCategory',
    val: '纯黑'
  },
  {
    key: 'colorCategory',
    val: '纯白'
  },
  {
    key: 'colorCategory',
    val: '狸花'
  },
  {
    key: 'colorCategory',
    val: '奶牛'
  },
  {
    key: 'colorCategory',
    val: '橘猫与橘白'
  },
  {
    key: 'colorCategory',
    val: '三花'
  },
  {
    key: 'colorCategory',
    val: '玳瑁'
  }
];

const CatItem = ({ cat }: { cat: Cat }) => {
  const { name, sex, colorCategory, _avatar } = cat;
  return (
    <View
      style={{
        backgroundColor: 'white',
        margin: '40px',
        flexDirection: 'row',
        height: '300px',
        borderRadius: '20px'
      }}
      onClick={() => navigateTo('cat-profile', { catKey: cat._id })}
    >
      <Image
        style={{ width: '200px', height: '200px', borderRadius: '20px' }}
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
    <Loadable loading={loading}>
      <LInput
        hide-label={true}
        placeholder="搜索名字"
        bindlininput={_l.throttle(({ detail: { value } }) => {
          setSelectedCats(_l.filter(_l.values(allCats), (cat) => cat.name.includes(value)));
        }, 100)}
      />
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'white',
            margin: '10px'
          }}
          onClick={() => setSelectedCats(_l.values(allCats))}
        >
          all
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
      </View>
      {catList}
    </Loadable>
  );

  // {loading ? <View>Loading</View> : <View></View>};
};

export default CatListPage;
