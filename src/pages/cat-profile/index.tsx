import Loadable from '@/components/loadable';
import { Cat } from '@/models/cats';
import { RootState } from '@/models/store';
import LAvatar from 'lin-ui/dist/avatar';
import { usePageEvent } from '@remax/framework-shared';
import { Text, View } from '@remax/wechat';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { navigateTo } from '@/utils';
import classNames from 'classnames';
import Photo from '@/components/photo';
import { TabPanel, Tabs } from '@/components/tabs';

export interface CatProfilePayload {
  catKey: string;
}

const InfoItem = ({
  field,
  val,
  full = false
}: {
  field: string;
  val: string | undefined;
  full?: boolean;
}) => {
  return val ? (
    <View className={`flex flex-col ${full ? 'w-full' : 'w-1on2'} font-light mt-4`}>
      <Text className="block text-xs text-gray-500">{field}</Text>
      <Text selectable className="block text-sm">
        {val}
      </Text>
    </View>
  ) : null;
};

const RelatedCatItem = ({ cat }: { cat: Cat }) => {
  return (
    <View
      className="flex flex-col items-center m-2 ml-0"
      onClick={() => navigateTo('cat-profile', { catKey: cat._id })}
    >
      <LAvatar size={90} src={cat._avatar ?? '/images/default-cat.jpg'} shape="circle" />
      <Text className="block text-xs font-light">{cat.name}</Text>
    </View>
  );
};

const CatProfilePage = () => {
  const [cat, setCat] = React.useState<Cat>();
  // TODO: 兜底没有这只猫的场景
  const { allCats } = useSelector((state: RootState) => ({
    allCats: state.cats.allCats
  }));
  usePageEvent('onLoad', ({ payload }) => {
    const { catKey } = JSON.parse(payload) as CatProfilePayload;
    console.log(allCats[catKey]);
    setCat(allCats[catKey]);
  });

  const {
    name,
    sex,
    colorCategory,
    relatedCats: relatedCatIds,
    relatedCatsDescription,
    _photos,
    _avatar,
    status,
    neuteringStatus,
    neuteringDate,
    character,
    colorDescription,
    nameOrigin,
    location,
    notes,
    noticeLevel,
    noticeDescription,
    nickname,
    healthStatus,
    healthDescription,
    adoptDescription,
    adoptContact
  } = cat ?? {};

  const relatedCats = relatedCatIds?.map((id) => allCats[id]);
  return (
    <View className="p-5">
      <Loadable loading={!cat}>
        <View className="p-5 bg-white rounded-lg shadow-xl mb-5">
          <Photo src={_photos?.[0] ?? _avatar} />
          {noticeDescription && (
            <View
              className={classNames(
                'mt-2 w-full shadow-xl rounded-lg text-sm text-gray-500 p-2 font-light box-border',
                {
                  'bg-red-200': noticeLevel === '高',
                  'bg-yellow-200': noticeLevel === '中',
                  'bg-blue-200': noticeLevel === '低'
                }
              )}
            >
              {noticeDescription}
            </View>
          )}
          <Text className="block text-gray-700 text-xl mb-2 font-bold w-full mt-2">{name}</Text>
          {nickname && <Text className="block text-gray-500 text-sm mb-2 w-full">{nickname}</Text>}
          <View className="mt-2 flex flex-wrap">
            {/* 半行 */}
            <InfoItem field="毛色" val={colorCategory} />
            <InfoItem field="性别" val={sex} />
            <InfoItem field="状况" val={status} />
            <InfoItem field="绝育情况" val={neuteringStatus} />
            <InfoItem field="绝育时间" val={neuteringDate} />

            {/* 整行 */}
            <InfoItem field="健康状态" val={healthStatus} full={true} />
            <InfoItem field="健康描述" val={healthDescription} full={true} />
            <InfoItem field="性格" val={character} full={true} />
            <InfoItem field="外貌描述" val={colorDescription} full={true} />
            <InfoItem field="名字来源" val={nameOrigin} full={true} />
            <InfoItem field="出没地点" val={location} full={true} />
            {status === '待领养' && (
              <>
                <InfoItem field="领养简介" val={adoptDescription} full={true} />
                <InfoItem field="领养联系" val={adoptContact} full={true} />
              </>
            )}
            <InfoItem field="备注" val={notes} full={true} />
            {(relatedCats ?? relatedCatsDescription) && (
              <View className="flex flex-col w-full font-light mt-4">
                <Text className="block text-xs text-gray-500">关系</Text>
                {relatedCatsDescription && (
                  <Text className="block text-sm">{relatedCatsDescription}</Text>
                )}
                {relatedCats && (
                  <View className="flex">
                    {relatedCats.map((cat) => (
                      <RelatedCatItem key={cat._id} cat={cat} />
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
        <Tabs>
          <TabPanel tab="精选照片">
            <View className="p-5 pt-0">
              {_photos?.slice(1)?.map((src) => (
                <Photo key={src} src={src} />
              ))}
            </View>
          </TabPanel>
          {/* <TabPanel tab="用户上传">
            <View />
          </TabPanel> */}
        </Tabs>
      </Loadable>
    </View>
  );
};

export default CatProfilePage;
