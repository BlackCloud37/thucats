import Loadable from '@/components/loadable';
import { Dispatch, RootState } from '@/models/store';
import { usePageEvent } from '@remax/framework-shared';
import { Text, View, showActionSheet } from '@remax/wechat';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import Photo from '@/components/photo';
import { TabPanel, Tabs } from '@/components/tabs';
import { ApiCat } from '@/typings/interfaces';
import { CAT_STATUS_ENUM } from '@/typings/db';
import { Button, Icon } from 'annar';
import InfoItem from './info-item';
import RelatedCatItem from './related-cat';
import UniForm from '@/components/uni-form';
import { FOSTER_SCHEMA, RESCUE_SCHEMA } from './form-schemas';
import { History } from '@/typings/db/history';
import dayjs from 'dayjs';
import curry from 'lodash.curry';
import HistoryCard from './history-card';

export interface CatProfilePayload {
  catKey: string;
}

const parseForm = (form: any): History => {
  // TODO: check
  console.log(form);
  if (form.dueRemainDays) {
    form.dueRemainDays = parseInt(form.dueRemainDays, 10);
  }
  if (!form.startDate) {
    form.startDate = dayjs().format('YYYY-MM-DD');
  }
  return form;
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

  const { updateCatAsync, addHistoryToCat } = useDispatch<Dispatch>().cats;

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
    history = []
  } = cat ?? {};

  const onEditCat = curry((key: keyof ApiCat, val: any) => {
    setCat({
      ...cat!,
      [key]: val
    });
  });

  const [editingForm, setEditingForm] = React.useState(false);
  const [formType, setFormType] = React.useState<'寄养' | '救助'>('寄养');
  const [folding, setFolding] = React.useState(true);

  const onCommit = (v: any) => {
    console.log(v);
    addHistoryToCat({
      catId: cat!._id,
      newHistory: {
        ...parseForm(v),
        historyType: formType
      }
    }).finally(() => {
      setEditingForm(false);
    });
  };

  const onNewHistoryTap = () => {
    // TODO: 检查是否能新增
    showActionSheet({
      itemList: ['寄养', '救助'],
      success: (v) => {
        if (v.tapIndex === 0) {
          setFormType('寄养');
        } else if (v.tapIndex === 1) {
          setFormType('救助');
        }
        setEditingForm(true);
      }
    });
  };

  const cancelEditBtn = (
    <Button
      onTap={() => {
        setEditing(false);
        setCat(allCats[catKey]);
      }}
      plain
      shape="square"
    >
      取消
    </Button>
  );

  const editBtn = (
    <Button
      onTap={() => {
        if (editing && cat) {
          updateCatAsync({
            ...cat,
            updatedFields: ['status', 'adoptContact', 'adoptDescription']
          }).catch(console.error);
        }
        setEditing(!editing);
      }}
      plain
      shape="square"
    >
      {editing ? '保存' : '编辑'}
    </Button>
  );

  const historyList = (folding ? [...history]?.slice(-1) : [...history].reverse())?.map(
    (history, index) => <HistoryCard key={index} history={history} showIcon />
  );

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
              <View className="flex gap-1">
                {editing && cancelEditBtn}
                {editBtn}
              </View>
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
            <InfoItem field="出没地点" val={location} full hide={!isOperator} />
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
            {/* 关联猫 */}
            {(relatedCats ?? relatedCatsDescription) && (
              <View className="flex flex-col w-full font-light mt-4">
                <Text className="block text-xs text-gray-500">关联猫咪</Text>
                {relatedCats?.map((cat, index) => {
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
        </View>

        <Tabs className="shadow-xl bg-white">
          <TabPanel tab="精选照片">
            <View className="p-5 pt-0">
              {_photos?.slice(1)?.map((src) => (
                <Photo key={src} src={src} />
              ))}
            </View>
          </TabPanel>
          {isOperator && (
            <TabPanel tab="记录">
              <View className="p-5 pt-0 flex flex-col items-start">
                {historyList}
                {history.length > 1 && (
                  <Button onTap={() => setFolding(!folding)}>{folding ? '展开' : '收起'}</Button>
                )}

                {/* 新增 */}
                <Button
                  style={{
                    marginTop: '2rem',
                    alignSelf: 'center'
                  }}
                  onTap={onNewHistoryTap}
                  type="primary"
                  shape="circle"
                  icon={<Icon type="roundadd" color="#1890FF" size="50px" />}
                  ghost
                />
                {editingForm && (formType === '寄养' || formType === '救助') && (
                  <UniForm
                    onFinish={onCommit}
                    schemas={formType === '寄养' ? FOSTER_SCHEMA : RESCUE_SCHEMA}
                    onCancel={() => setEditingForm(false)}
                  />
                )}
              </View>
            </TabPanel>
          )}
          {/* <TabPanel tab="用户上传">
            <View />
          </TabPanel> */}
        </Tabs>
      </Loadable>
    </View>
  );
};

export default CatProfilePage;
