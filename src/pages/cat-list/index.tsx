import { Dispatch, RootState } from '@/models/store';
import { Text, View } from '@remax/wechat';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loadable from '@/components/loadable';
import LInput from 'lin-ui/dist/input';
import TabBar from '@/components/tabbar';
import { usePageEvent } from '@remax/macro';
import { ApiCat } from '@/typings/interfaces';
import CatItem from './components/cat-item';
import { catLastHistory } from '@/models/cats';
import dayjs from 'dayjs';
import size from 'lodash.size';
import curry from 'lodash.curry';
import sortBy from 'lodash.sortby';
import filter from 'lodash.filter';
import throttle from 'lodash.throttle';

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

  const [selectedCats, setSelectedCats] = React.useState<ApiCat[]>([]);
  const { allCatsList, loading, isOperator } = useSelector((state: RootState) => ({
    allCatsList: state.cats.allCatsList,
    loading: state.loading.effects.cats.fetchAllCatsAsync,
    isOperator: state.users.isOperator
  }));
  const { fetchAllCatsAsync } = useDispatch<Dispatch>().cats;

  React.useEffect(() => {
    fetchAllCatsAsync().catch(console.error);
  }, []);
  React.useEffect(() => {
    setSelectedCats(allCatsList);
  }, [allCatsList]);

  const catList =
    size(selectedCats) > 0 ? (
      selectedCats.map((cat: ApiCat) => (
        <CatItem key={cat._id} cat={cat} className="mb-5" showHistory={isOperator} />
      ))
    ) : (
      <Text className="block w-full text-sm font-light text-gray-500 text-center">
        这里似乎没有猫咪
      </Text>
    );

  const priority2num = {
    高: 2,
    中: 1,
    低: 0
  };
  const filterHistoryAndSort = (pred: (c: ApiCat) => boolean) => {
    setSelectedCats(
      sortBy(
        filter(allCatsList, pred),
        (c) => {
          const lastHistory = catLastHistory(c);
          return lastHistory ? priority2num[lastHistory.priority] : -1;
        },
        (c) => {
          const lastHistory = catLastHistory(c);
          const { historyType, startDate } = lastHistory;
          const duraDays = Math.max(dayjs().diff(startDate, 'days'), 0);
          console.log(lastHistory, startDate, duraDays);
          if (historyType === '寄养') {
            return duraDays;
          } else if (historyType === '救助') {
            const { dueRemainDays = 0 } = lastHistory;
            const remianDays = Math.max(dueRemainDays - duraDays, 0);
            return -remianDays;
          }
        }
      ).reverse()
    );
  };

  const filterByKeyValue = curry(
    (k: keyof ApiCat, v: string) => () => setSelectedCats(filter(allCatsList, (c) => c[k] === v))
  );
  const filterByColorCategory = filterByKeyValue('colorCategory');
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
        <View className="flex flex-nowrap gap-4 overflow-scroll mb-5">
          <FilterItem fieldName="所有" filterCallback={() => setSelectedCats(allCatsList)} />
          <FilterItem fieldName="纯黑" filterCallback={filterByColorCategory('纯黑')} />
          <FilterItem fieldName="纯白" filterCallback={filterByColorCategory('纯白')} />
          <FilterItem fieldName="狸花" filterCallback={filterByColorCategory('狸花')} />
          <FilterItem fieldName="奶牛" filterCallback={filterByColorCategory('奶牛')} />
          <FilterItem fieldName="橘猫" filterCallback={filterByColorCategory('橘猫与橘白')} />
          <FilterItem fieldName="三花" filterCallback={filterByColorCategory('三花')} />
          <FilterItem fieldName="玳瑁" filterCallback={filterByColorCategory('玳瑁')} />
          {isOperator && (
            <>
              <FilterItem
                fieldName="寄养中"
                filterCallback={() => {
                  filterHistoryAndSort((c) => {
                    const lastHistory = catLastHistory(c);
                    return lastHistory?.historyType === '寄养';
                  });
                }}
              />
              <FilterItem
                fieldName="住院中"
                filterCallback={() => {
                  filterHistoryAndSort((c) => {
                    const lastHistory = catLastHistory(c);
                    return lastHistory?.historyType === '救助';
                  });
                }}
              />
            </>
          )}
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
