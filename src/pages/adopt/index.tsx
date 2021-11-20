import { ApiCat } from '@/typings/interfaces';
import { Dispatch, RootState } from '@/models/store';
import { Image, Text, View } from '@remax/wechat';
import { usePageEvent } from '@remax/macro';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { default as _l } from 'lodash';
import CatItem from '@/pages/cat-list/components/cat-item';
import { TabPanel, Tabs } from '@/components/tabs';
import Loadable from '@/components/loadable';

const AdoptPage = () => {
  usePageEvent('onShareAppMessage', () => ({
    title: '猫咪领养',
    path: '/pages/adopt/index'
  }));

  const [selectedCats, setSelectedCats] = React.useState<ApiCat[]>([]);
  const { allCatsList, loading, adoptGuideUrl } = useSelector((state: RootState) => ({
    allCatsList: state.cats.allCatsList,
    adoptGuideUrl: state.settings.adoptGuideUrl,
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
      selectedCats.map((cat: ApiCat) => <CatItem key={cat._id} cat={cat} adopt className="mb-5" />)
    ) : (
      <Text className="block w-full text-sm font-light text-gray-500 text-center">
        目前没有待领养的猫咪
      </Text>
    );
  return (
    <View className="p-5 font-light">
      <Tabs>
        {adoptGuideUrl && (
          <TabPanel tab="领养须知">
            <Image webp mode="widthFix" src={adoptGuideUrl} className="rounded-lg w-full" />
          </TabPanel>
        )}
        <TabPanel tab="待领养">
          <Loadable loading={loading} loader="running-cat">
            {catList}
          </Loadable>
        </TabPanel>
      </Tabs>
    </View>
  );
};

export default AdoptPage;
