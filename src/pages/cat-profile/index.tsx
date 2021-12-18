/* eslint-disable complexity */
import Loadable from '@/components/loadable';
import { Dispatch, RootState } from '@/models/store';
import { usePageEvent } from '@remax/framework-shared';
import {
  Text,
  View,
  showActionSheet,
  cloud,
  compressImage,
  showToast,
  hideLoading,
  showLoading,
  pageScrollTo,
  getUserProfile,
  showModal
} from '@remax/wechat';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import Photo from '@/components/photo';
import { TabPanel, Tabs } from '@/components/tabs';
import { ApiCat } from '@/typings/interfaces';
import { CAT_STATUS_ENUM } from '@/typings/db';
import { Button, Icon, ImageUpload } from 'annar';
import InfoItem from '@/components/info-item';
import RelatedCatItem from '@/components/related-cat';
import UniForm from '@/components/uni-form';
import { FOSTER_SCHEMA, RESCUE_SCHEMA } from './form-schemas';
import { History } from '@/typings/db/history';
import dayjs from 'dayjs';
import curry from 'lodash.curry';
import HistoryCard from '@/components/history-card';
import Album from '@/components/album';
import { catLastHistory } from '@/models/cats';

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
  const [uploadFiles, setUploadFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  // TODO: 兜底没有这只猫的场景
  const { allCats, isOperator, user } = useSelector((state: RootState) => ({
    allCats: state.cats.allCats,
    ...state.users
  }));
  const { openid } = user ?? {};

  const { updateCatAsync, addHistoryToCatAsync: addHistoryToCat } = useDispatch<Dispatch>().cats;
  const { createRequestAsync, loginAsync } = useDispatch<Dispatch>().users;

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
    history = [],
    _userPhotos = []
  } = cat ?? {};

  const lastHistory = catLastHistory(cat);
  const canAddHistory = !lastHistory || lastHistory.isDone;

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
      _id: cat!._id,
      history: {
        ...parseForm(v),
        historyType: formType
      }
    })
      .then(() => showToast({ title: '成功', icon: 'success' }))
      .catch(() => showToast({ title: '失败', icon: 'error' }))
      .finally(() => {
        setEditingForm(false);
      });
  };

  const onNewHistoryTap = () => {
    if (!canAddHistory) {
      showModal({
        title: '提示',
        content: '请先将最后一条记录标记为完成，才能发起新的记录',
        showCancel: false
      });
      return;
    }
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
    (history, index) => <HistoryCard key={index} history={history} showIcon catID={catKey} />
  );

  const handleUploadImage = () => {
    const timestamp = new Date().getTime();
    console.log(uploadFiles);

    if (uploadFiles?.length) {
      showLoading({
        title: '上传中'
      });
      // 压缩并上传图片
      const uploadPromises = uploadFiles.map((src, index) => {
        return compressImage({
          src,
          quality: 80
        }).then(({ tempFilePath, errMsg }) => {
          console.log(tempFilePath, errMsg);
          return cloud.uploadFile({
            cloudPath: `userupload/${openid}/${timestamp}-${index}.jpg`,
            filePath: tempFilePath
          });
        });
      });
      // 发起请求
      Promise.all(uploadPromises)
        .then((values) => {
          const uploadFileIDs = values.map(({ errMsg, fileID }) => {
            console.log(errMsg, fileID);
            return fileID;
          });
          console.log(uploadFileIDs);

          return createRequestAsync({
            requestType: 'imageUpload',
            imageUploadInfo: {
              catID: catKey,
              filePaths: uploadFileIDs,
              _createTime: new Date().getTime(),
              catName: name!
            }
          });
        })
        .then(() => {
          showToast({
            title: '上传成功',
            icon: 'success'
          });
          setUploadFiles([]);
        })
        .catch((e) => {
          console.error(e);
          showToast({
            title: '上传失败',
            icon: 'error'
          });
        })
        .finally(() => {
          hideLoading();
        });
    } else {
      showToast({
        title: '没有选择图片',
        icon: 'error'
      });
    }
  };

  const getProfileAndLogin = () => {
    return getUserProfile({
      desc: '获取你的昵称、头像'
    }).then((result) => {
      return loginAsync(result.userInfo);
    });
  };
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
          <TabPanel tab="用户上传">
            <Album urls={_userPhotos.map(({ url }) => url)} />
          </TabPanel>
          {isOperator && (
            <TabPanel tab="记录">
              <View className="p-5 pt-0 flex flex-col items-start">
                {historyList}
                {history.length > 1 && (
                  <Button style={{ marginTop: '1rem' }} onTap={() => setFolding(!folding)}>
                    {folding ? '展开所有' : '收起'}
                  </Button>
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
                  // disabled={!canAddHistory}
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
        </Tabs>

        {/* 上传按钮及图片上传器 */}
        <Button
          style={{
            height: '100px',
            width: '100px',
            position: 'fixed',
            right: '10px',
            bottom: '110px'
          }}
          shape="circle"
          ghost
          icon={<Icon type="roundaddfill" color="#1890FF" size="100px" />}
          onTap={() => {
            if (openid) {
              setUploading(true);
              pageScrollTo({
                selector: '#uploader'
              });
            } else {
              getProfileAndLogin().then(() => {
                setUploading(true);
                pageScrollTo({
                  selector: '#uploader'
                });
              });
            }
          }}
        />
        <View
          className={classNames('mt-2 rounded-lg bg-white', {
            'p-5': uploading
          })}
          id="uploader"
        >
          {uploading && (
            <>
              <ImageUpload
                maxCount={9}
                files={uploadFiles}
                onChange={(files: any) => setUploadFiles(files)}
              />
              <Button style={{ marginTop: '10px' }} onTap={handleUploadImage}>
                上传照片
              </Button>
            </>
          )}
        </View>
      </Loadable>
    </View>
  );
};

export default CatProfilePage;
