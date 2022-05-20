import { Dispatch, RootState } from '@/models/store';
import { Text, View, Image } from '@remax/wechat';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loadable from '@/components/loadable';
import LInput from 'lin-ui/dist/input';
import TabBar from '@/components/tabbar';
import { usePageEvent } from '@remax/macro';
import { ApiCat } from '@/typings/interfaces';
import CatItem from './components/cat-item';
import { catLastHistory, sortCatByHistoryPriority } from '@/models/cats';
import size from 'lodash.size';
import curry from 'lodash.curry';
import filter from 'lodash.filter';
import throttle from 'lodash.throttle';

const FilterItem = ({
  fieldName,
  filterCallback,
  bgImg
}: {
  fieldName: string;
  filterCallback: any;
  bgImg?: string;
}) => {
  return (
    <View className="flex flex-col items-center" onClick={filterCallback}>
      <Image className="w-12 h-12 rounded-lg bg-white" src={bgImg} />
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

  const [selectedCats, setSelectedCats] = React.useState<ApiCat[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);

  const { allCatsList, loading, isAdmin, filterIconIcons } = useSelector((state: RootState) => ({
    allCatsList: state.cats.allCatsList,
    loading: state.loading.effects.cats.fetchAllCatsAsync,
    isAdmin: state.users.isAdmin,
    filterIconIcons: state.settings.filterIconIcons
  }));
  const { fetchAllCatsAsync } = useDispatch<Dispatch>().cats;

  usePageEvent('onPullDownRefresh', () => {
    fetchAllCatsAsync({ force: true }).catch(console.error);
  });
  React.useEffect(() => {
    fetchAllCatsAsync({ force: false }).catch(console.error);
  }, []);

  React.useEffect(() => {
    setSelectedCats(allCatsList);
  }, [allCatsList]);

  // filters
  const filterByKeyValues = curry((k: keyof ApiCat, vs: string[]) => () => {
    setShowHistory(false);
    setSelectedCats(filter(allCatsList, (c) => vs.some((v) => c[k] === v)));
  });
  const filterByColorCategory = filterByKeyValues('colorCategory');
  const filterByStatus = filterByKeyValues('status');
  const filterAndSortByHistory = (pred: (c: ApiCat) => boolean) => {
    setShowHistory(true);
    setSelectedCats(sortCatByHistoryPriority(filter(allCatsList, pred)));
  };
  const filterByRescue = () => {
    filterAndSortByHistory((c) => {
      const lastHistory = catLastHistory(c);
      return lastHistory?.historyType === '救助' && !lastHistory?.isDone;
    });
  };
  const filterByFoster = () => {
    filterAndSortByHistory((c) => {
      const lastHistory = catLastHistory(c);
      return lastHistory?.historyType === '寄养' && !lastHistory?.isDone;
    });
  };

  const catList = (
    <Loadable loading={loading || allCatsList.length === 0} loader="running-cat">
      {size(selectedCats) > 0 ? (
        selectedCats.map((cat: ApiCat) => (
          <CatItem key={cat._id} cat={cat} className="mb-5" showHistory={showHistory} />
        ))
      ) : (
        <Text className="block w-full text-sm font-light text-gray-500 text-center">
          这里似乎没有猫咪
        </Text>
      )}
    </Loadable>
  );

  const searchInput = (
    <LInput
      hide-label
      clear
      placeholder="搜索"
      l-row-class="hidden"
      l-class="text-center mb-5 rounded-lg bg-gray-400 bg-opacity-20 font-semibold text-lg shadow-inner"
      bindlininput={throttle(({ detail: { value } }) => {
        value
          ? setSelectedCats(filter(allCatsList, (cat) => cat.name.includes(value)))
          : setSelectedCats(allCatsList);
      }, 500)}
      bindlinclear={() => {
        setSelectedCats(allCatsList);
      }}
    />
  );

  const filters = [
    {
      fieldName: '所有',
      callback: () => {
        setShowHistory(false);
        setSelectedCats(allCatsList);
      }
    },
    {
      fieldName: '纯色',
      callback: filterByColorCategory(['纯黑', '纯白'])
    },
    {
      fieldName: '狸花',
      callback: filterByColorCategory(['狸花', '狸白'])
    },
    {
      fieldName: '奶牛',
      callback: filterByColorCategory(['奶牛'])
    },
    {
      fieldName: '橘猫',
      callback: filterByColorCategory(['橘猫', '橘白'])
    },
    {
      fieldName: '三花',
      callback: filterByColorCategory(['三花'])
    },
    {
      fieldName: '玳瑁',
      callback: filterByColorCategory(['玳瑁'])
    },
    {
      fieldName: '在野',
      callback: filterByStatus(['在野'])
    },
    {
      fieldName: '已送养',
      callback: filterByStatus(['已送养'])
    },
    {
      fieldName: '喵星',
      callback: filterByStatus(['喵星'])
    }
  ];

  return (
    <>
      <View className="p-5 font-light">
        {searchInput}
        <View className="flex flex-nowrap gap-3 overflow-scroll">
          {filters.map(({ fieldName, callback }, index) => (
            <FilterItem
              key={index}
              fieldName={fieldName}
              filterCallback={callback}
              bgImg={filterIconIcons[index]}
            />
          ))}
        </View>
        {isAdmin && (
          <View className="flex flex-nowrap gap-3 overflow-scroll mb-3">
            <FilterItem
              fieldName="寄养中"
              filterCallback={filterByFoster}
              bgImg={filterIconIcons[10]}
            />
            <FilterItem
              fieldName="住院中"
              filterCallback={filterByRescue}
              bgImg={filterIconIcons[11]}
            />
          </View>
        )}
        {catList}
      </View>
      <TabBar />
    </>
  );
};

export default CatListPage;
