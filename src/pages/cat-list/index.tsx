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

  const { allCatsList, loading, isOperator, filterIconIcons } = useSelector((state: RootState) => ({
    allCatsList: state.cats.allCatsList,
    loading: state.loading.effects.cats.fetchAllCatsAsync,
    isOperator: state.users.isOperator,
    filterIconIcons: state.settings.filterIconIcons
  }));
  const { fetchAllCatsAsync } = useDispatch<Dispatch>().cats;

  const initData = () => {
    fetchAllCatsAsync().catch(console.error);
  };
  usePageEvent('onPullDownRefresh', () => {
    initData();
  });
  React.useEffect(() => {
    initData();
  }, []);

  React.useEffect(() => {
    setSelectedCats(allCatsList);
  }, [allCatsList]);

  const catList =
    size(selectedCats) > 0 ? (
      selectedCats.map((cat: ApiCat) => (
        <CatItem key={cat._id} cat={cat} className="mb-5" showHistory={showHistory} />
      ))
    ) : (
      <Text className="block w-full text-sm font-light text-gray-500 text-center">
        这里似乎没有猫咪
      </Text>
    );

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
      console.log(lastHistory);
      return lastHistory?.historyType === '救助' && !lastHistory?.isDone;
    });
  };

  const filterByFoster = () => {
    filterAndSortByHistory((c) => {
      const lastHistory = catLastHistory(c);
      return lastHistory?.historyType === '寄养' && !lastHistory?.isDone;
    });
  };
  return (
    <>
      <View className="p-5 font-light">
        <LInput
          hide-label={true}
          placeholder="搜索"
          clear={true}
          bindlininput={throttle(({ detail: { value } }) => {
            value
              ? setSelectedCats(filter(allCatsList, (cat) => cat.name.includes(value)))
              : setSelectedCats(allCatsList);
          }, 500)}
          bindlinclear={() => {
            setSelectedCats(allCatsList);
          }}
          l-class="text-center mb-5 rounded-lg bg-gray-400 bg-opacity-20 font-semibold text-lg shadow-inner"
          l-row-class="hidden"
        />
        <View className="flex flex-nowrap gap-3 overflow-scroll">
          <FilterItem
            fieldName="所有"
            filterCallback={() => {
              setShowHistory(false);
              setSelectedCats(allCatsList);
            }}
            bgImg={filterIconIcons[0]}
          />
          <FilterItem
            fieldName="纯色"
            filterCallback={filterByColorCategory(['纯黑', '纯白'])}
            bgImg={filterIconIcons[1]}
          />
          <FilterItem
            fieldName="狸花"
            filterCallback={filterByColorCategory(['狸花', '狸白'])}
            bgImg={filterIconIcons[2]}
          />
          <FilterItem
            fieldName="奶牛"
            filterCallback={filterByColorCategory(['奶牛'])}
            bgImg={filterIconIcons[3]}
          />
          <FilterItem
            fieldName="橘猫"
            filterCallback={filterByColorCategory(['橘猫', '橘白'])}
            bgImg={filterIconIcons[4]}
          />
          <FilterItem
            fieldName="三花"
            filterCallback={filterByColorCategory(['三花'])}
            bgImg={filterIconIcons[5]}
          />
          <FilterItem
            fieldName="玳瑁"
            filterCallback={filterByColorCategory(['玳瑁'])}
            bgImg={filterIconIcons[6]}
          />
          <FilterItem
            fieldName="在野"
            filterCallback={filterByStatus(['在野'])}
            bgImg={filterIconIcons[7]}
          />
          <FilterItem
            fieldName="已送养"
            filterCallback={filterByStatus(['已送养'])}
            bgImg={filterIconIcons[8]}
          />
          <FilterItem
            fieldName="喵星"
            filterCallback={filterByStatus(['喵星'])}
            bgImg={filterIconIcons[9]}
          />
        </View>
        {isOperator && (
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

        <Loadable loading={loading} loader="running-cat">
          {catList}
        </Loadable>
      </View>
      <TabBar />
    </>
  );
};

export default CatListPage;
