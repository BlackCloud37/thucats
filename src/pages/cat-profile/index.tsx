import Loadable from '@/components/loadable';
import { Dispatch, RootState } from '@/models/store';
import { usePageEvent } from '@remax/framework-shared';
import { Text, View } from '@remax/wechat';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigateTo } from '@/utils';
import classNames from 'classnames';
import Photo from '@/components/photo';
import { TabPanel, Tabs } from '@/components/tabs';
import Clipable from '@/components/clipable';
import { ApiCat } from '@/typings/interfaces';
import { CAT_STATUS_ENUM, DbCat } from '@/typings/db';
import Avatar from '@/components/avatar';
import 'annar/esm/picker/style/css';
import 'annar/esm/input/style/css';
import 'annar/esm/button/style/css';
import { Button, Picker, Input } from 'annar';
import _ from 'lodash';

export interface CatProfilePayload {
  catKey: string;
}

const InfoItem = <T,>({
  field,
  val,
  full = false,
  clipable = false,
  editable = false,
  range,
  onEdit
}: {
  field: string;
  val: string | undefined;
  full?: boolean;
  clipable?: boolean;
  editable?: boolean;
  range?: readonly T[];
  onEdit?: (value: T) => void; // callback
}) => {
  if (!val && !editable) {
    return null;
  }
  // show
  const content = (
    <Text
      selectable
      className={classNames('block text-sm', { 'underline text-blue-500': clipable })}
    >
      {val}
    </Text>
  );
  const showContent = clipable ? <Clipable clipContent={val!}>{content}</Clipable> : content;

  // edit
  const editContent = range ? (
    <Picker
      range={range as any[]}
      onChange={(index) => {
        const selected = range[index as number];
        selected && onEdit?.(selected);
      }}
    >
      <Button plain shape="square">
        {val}
      </Button>
    </Picker>
  ) : (
    // input
    <Input
      onChange={({ target: { value } }) => {
        console.log(value);
        onEdit?.(value);
      }}
      value={val}
      className="shadow-inner"
      style={{ borderRadius: '0.5rem' }} // rounded-lg
    />
  );

  return (
    <View className={`flex flex-col ${full ? 'w-full' : 'w-1on2'} font-light mt-4`}>
      <Text className="block text-xs text-gray-500">{field}</Text>
      {editable ? editContent : showContent}
    </View>
  );
};

const RelatedCatItem = ({ cat, desc }: { cat: DbCat; desc?: string }) => {
  return (
    <View
      className="flex mt-2 w-full"
      onClick={() => navigateTo('cat-profile', { catKey: cat._id })}
    >
      <Avatar src={cat._avatar} className="w-12 h-12 rounded-full" />
      <View className="flex-col pl-2">
        <Text className="block w-full text-xs font-normal">{cat.name}</Text>
        <Text className="block w-full text-xs font-light">{desc}</Text>
      </View>
    </View>
  );
};

const CatProfilePage = () => {
  const [cat, setCat] = React.useState<ApiCat>();
  const [catKey, setKey] = React.useState('');
  const [editing, setEditing] = React.useState(false);

  // TODO: 兜底没有这只猫的场景
  const { allCats, isOperator } = useSelector((state: RootState) => ({
    allCats: state.cats.allCats,
    ...state.users
  }));

  const { updateCatAsync } = useDispatch<Dispatch>().cats;

  usePageEvent('onLoad', ({ payload }) => {
    // TODO: fetch server
    const { catKey } = JSON.parse(payload) as CatProfilePayload;
    console.log(allCats[catKey]);
    setKey(catKey);
  });

  React.useEffect(() => {
    catKey && setCat(allCats[catKey]);
  }, [allCats, catKey]);

  const {
    name,
    sex,
    colorCategory,
    relatedCats,
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
    adoptContact,
    birthday,
    age,
    history
  } = cat ?? {};

  const onEditCat = _.curry((key: keyof ApiCat, val: any) => {
    setCat({
      ...cat!,
      [key]: val
    });
  });

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
          <View className="flex justify-between w-full mb-2 mt-2">
            <Text className="block text-gray-700 text-xl font-bold">{name}</Text>
            {isOperator && (
              <Button
                onTap={() => {
                  if (editing && cat) {
                    updateCatAsync(cat).catch(console.error);
                  }
                  setEditing(!editing);
                }}
                plain
                shape="square"
              >
                {editing ? '保存' : '编辑'}
              </Button>
            )}
          </View>

          {nickname && <Text className="block text-gray-500 text-sm mb-2 w-full">{nickname}</Text>}
          <View className="mt-2 flex flex-wrap">
            {/* 半行 */}
            <InfoItem field="毛色" val={colorCategory} />
            <InfoItem field="性别" val={sex} />
            <InfoItem
              field="状况"
              val={status}
              editable={editing}
              range={CAT_STATUS_ENUM}
              onEdit={onEditCat('status')}
            />
            <InfoItem field="年龄" val={age} />
            <InfoItem field="生日" val={birthday} />
            <InfoItem field="绝育情况" val={neuteringStatus} />
            <InfoItem field="绝育时间" val={neuteringDate} />

            {/* 整行 */}
            <InfoItem field="健康状态" val={healthStatus} full />
            <InfoItem field="健康描述" val={healthDescription} full />
            <InfoItem field="性格" val={character} full />
            <InfoItem field="外貌描述" val={colorDescription} full />
            <InfoItem field="名字来源" val={nameOrigin} full />
            <InfoItem field="出没地点" val={location} full />
            {status === '待领养' && (
              <>
                <InfoItem
                  field="领养简介"
                  val={adoptDescription}
                  full
                  editable={editing}
                  onEdit={onEditCat('adoptDescription')}
                />
                <InfoItem
                  field="领养联系"
                  val={adoptContact}
                  full
                  clipable
                  editable={editing}
                  onEdit={onEditCat('adoptContact')}
                />
              </>
            )}
            <InfoItem field="备注" val={notes} full />
            {(relatedCats ?? relatedCatsDescription) && (
              <View className="flex flex-col w-full font-light mt-4">
                <Text className="block text-xs text-gray-500">关联猫咪</Text>
                {relatedCats?.map((cat, index) => {
                  console.log(cat);
                  return (
                    cat && (
                      <RelatedCatItem
                        key={cat._id}
                        cat={cat}
                        desc={relatedCatsDescription?.[index]}
                      />
                    )
                  );
                })}
              </View>
            )}
          </View>
          {isOperator && history?.map((his) => his.historyType)}
        </View>
        <Tabs className="shadow-xl bg-white">
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
