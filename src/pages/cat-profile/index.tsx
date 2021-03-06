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
import { pageScrollTo, createSelectorQuery } from 'remax/wechat';
import groupBy from 'lodash.groupby';
import flatMap from 'lodash.flatmap';
import LLoadMore from 'lin-ui/dist/loadmore';

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

const scrollToBottom = () => {
  createSelectorQuery()
    .select('#page')
    .boundingClientRect((rect: any) => {
      pageScrollTo({
        scrollTop: rect.bottom
      });
    })
    .exec();
};

const CatProfilePage = () => {
  const [cat, setCat] = React.useState<ApiCat>();
  const [catKey, setKey] = React.useState('');
  const [editing, setEditing] = React.useState(false);
  const [uploadFiles, setUploadFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  const { allCats, isAdmin, user } = useSelector((state: RootState) => ({
    allCats: state.cats.allCats,
    ...state.users
  }));
  const {
    updateCatAsync,
    addHistoryToCatAsync: addHistoryToCat,
    pullCatByIdAsync,
    createRequestAsync,
    loginAsync
  } = {
    ...useDispatch<Dispatch>().cats,
    ...useDispatch<Dispatch>().users
  };

  const { openid } = user ?? {};

  usePageEvent('onLoad', ({ payload }) => {
    const { catKey } = JSON.parse(payload) as CatProfilePayload;
    console.log(allCats[catKey]);
    setKey(catKey);
  });

  usePageEvent('onPullDownRefresh', () => {
    pullCatByIdAsync(catKey);
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
    _relatedImageRequests = []
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
  const [formType, setFormType] = React.useState<'??????' | '??????'>('??????');
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
      .then(() => showToast({ title: '??????', icon: 'success' }))
      .catch(() => showToast({ title: '??????', icon: 'error' }))
      .finally(() => {
        setEditingForm(false);
      });
  };

  const onNewHistoryTap = () => {
    if (!canAddHistory) {
      showModal({
        title: '??????',
        content: '?????????????????????????????????????????????????????????????????????',
        showCancel: false
      });
      return;
    }
    showActionSheet({
      itemList: ['??????', '??????'],
      success: (v: any) => {
        if (v.tapIndex === 0) {
          setFormType('??????');
        } else if (v.tapIndex === 1) {
          setFormType('??????');
        }
        setEditingForm(true);
      }
    });
  };

  const historyList = (folding ? [...history]?.slice(-1) : [...history].reverse())?.map(
    (history, index) => <HistoryCard key={index} history={history} showIcon catID={catKey} />
  );

  const handleUploadImage = () => {
    const timestamp = new Date().getTime();
    console.log(uploadFiles);

    if (uploadFiles?.length) {
      showLoading({
        title: '?????????'
      });
      // ?????????????????????
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
      // ????????????
      Promise.all(uploadPromises)
        .then((values) => {
          const uploadFileIDs = values.map(({ errMsg, fileID }) => {
            console.log(errMsg, fileID);
            return fileID;
          });
          console.log(uploadFileIDs);

          return createRequestAsync({
            requestType: 'imageUpload',
            catID: catKey,
            filePaths: uploadFileIDs
          });
        })
        .then(() => {
          showToast({
            title: '????????????',
            icon: 'success'
          });
          setUploadFiles([]);
        })
        .catch((e) => {
          console.error(e);
          showToast({
            title: '????????????',
            icon: 'error'
          });
        })
        .finally(() => {
          hideLoading();
        });
    } else {
      showToast({
        title: '??????????????????',
        icon: 'error'
      });
    }
  };

  const getProfileAndLogin = () => {
    return getUserProfile({
      desc: '???????????????????????????'
    }).then((result) => {
      return loginAsync(result.userInfo);
    });
  };

  // albums
  // ????????????????????????
  const _userPhotos = flatMap(_relatedImageRequests, (req) => {
    return (
      req?.filePaths?.map((url) => {
        return {
          url,
          _createTime: req._createTime
        };
      }) || []
    );
  });

  const photosGroupByMon = groupBy(_userPhotos, ({ _createTime }) =>
    dayjs(_createTime).format('YYYY/M')
  );
  const sortedKeys = Object.keys(photosGroupByMon)
    .sort((a, b) => {
      const [ay, am] = a.split('/');
      const [by, bm] = b.split('/');
      return 100 * (parseInt(ay, 10) - parseInt(by, 10)) + (parseInt(am, 10) - parseInt(bm, 10));
    })
    .reverse();
  const albums = sortedKeys.map((date) => {
    const [y, m] = date.split('/');
    return (
      <View key={date}>
        <View className="pl-3 mt-1">
          <Text className="text-sm">{`${y}???${m}???`}</Text>
        </View>
        <Album urls={photosGroupByMon[date].map(({ url }) => url)} />
      </View>
    );
  });

  // Components
  const cancelEditBtn = (
    <Button
      onTap={() => {
        setEditing(false);
        setCat(allCats[catKey]);
      }}
      plain
      shape="square"
    >
      ??????
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
      {editing ? '??????' : '??????'}
    </Button>
  );

  const noticeBlock = (
    <View
      className={classNames(
        'mt-2 w-full shadow-xl rounded-lg text-sm text-gray-500 p-2 font-light box-border',
        {
          'bg-red-200': noticeLevel === '???',
          'bg-yellow-200': noticeLevel === '???',
          'bg-blue-200': noticeLevel === '???'
        }
      )}
    >
      {noticeDescription}
    </View>
  );

  const nameBlock = (
    <View className="flex justify-between w-full mb-2 mt-2">
      <Text className="block text-gray-700 text-xl font-bold">{name}</Text>
      {isAdmin && (
        <View className="flex gap-1">
          {editing && cancelEditBtn}
          {editBtn}
        </View>
      )}
    </View>
  );

  const infomationBlock = (
    <View className="mt-2 flex flex-wrap">
      {/* ?????? */}
      <InfoItem field="??????" val={colorCategory} />
      <InfoItem field="??????" val={sex} />

      <InfoItem
        field="??????"
        val={status}
        editable={editing}
        range={CAT_STATUS_ENUM}
        onEdit={onEditCat('status')}
      />
      <InfoItem field="??????" val={age} />
      <InfoItem field="??????" val={birthday} />
      <InfoItem field="????????????" val={neuteringStatus} />
      <InfoItem field="????????????" val={neuteringDate} />

      {/* ?????? */}
      <InfoItem field="????????????" val={healthStatus} full />
      <InfoItem field="????????????" val={healthDescription} full />
      <InfoItem field="??????" val={character} full />
      <InfoItem field="????????????" val={colorDescription} full />
      <InfoItem field="????????????" val={nameOrigin} full />
      <InfoItem field="????????????" val={location} full hide={!isAdmin} />
      {status === '?????????' && (
        <>
          <InfoItem
            field="????????????"
            val={adoptDescription}
            full
            editable={editing}
            onEdit={onEditCat('adoptDescription')}
          />
          <InfoItem
            field="????????????"
            val={adoptContact}
            full
            clipable
            editable={editing}
            onEdit={onEditCat('adoptContact')}
          />
        </>
      )}
      <InfoItem field="??????" val={notes} full />
      {/* ????????? */}
      {(relatedCats ?? relatedCatsDescription) && (
        <View className="flex flex-col w-full font-light mt-4">
          <Text className="block text-xs text-gray-500">????????????</Text>
          {relatedCats?.map((cat, index) => {
            return (
              <RelatedCatItem key={cat._id} cat={cat} desc={relatedCatsDescription?.[index]} />
            );
          })}
        </View>
      )}
    </View>
  );

  const historyBlock = (
    <View className="p-5 pt-0 flex flex-col items-start">
      {historyList}
      {history.length > 1 && (
        <Button style={{ marginTop: '1rem' }} onTap={() => setFolding(!folding)}>
          {folding ? '????????????' : '??????'}
        </Button>
      )}

      {/* ?????? */}
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
      {editingForm && (formType === '??????' || formType === '??????') && (
        <UniForm
          onFinish={onCommit}
          schemas={formType === '??????' ? FOSTER_SCHEMA : RESCUE_SCHEMA}
          onCancel={() => setEditingForm(false)}
        />
      )}
    </View>
  );

  const imageUploadBlock = (
    <>
      <Button
        type="primary"
        shape="circle"
        icon="picfill"
        float
        size="large"
        style={{
          position: 'fixed',
          right: '10px',
          bottom: '110px'
        }}
        onTap={() => {
          if (openid) {
            setUploading(true);
            scrollToBottom();
          } else {
            getProfileAndLogin().then(() => {
              setUploading(true);
              scrollToBottom();
            });
          }
        }}
      />
      <View
        className={classNames('mt-2 rounded-lg bg-white', {
          'p-5': uploading
        })}
      >
        {uploading && (
          <>
            <ImageUpload
              maxCount={9}
              files={uploadFiles}
              onChange={(files: any) => setUploadFiles(files)}
            />
            <Button style={{ marginTop: '10px' }} onTap={handleUploadImage}>
              ????????????
            </Button>
          </>
        )}
      </View>
    </>
  );

  return (
    <View className="p-5" id="page">
      <Loadable loading={!cat}>
        <View className="p-5 bg-white rounded-lg shadow-xl mb-5">
          {/* Avatar */}
          <Photo src={_photos?.[0] ?? _avatar} grey={status === '??????'} />
          {/* Notice */}
          {noticeDescription && noticeBlock}
          {/* Name and edit btn */}
          {nameBlock}
          {nickname && <Text className="block text-gray-500 text-sm mb-2 w-full">{nickname}</Text>}
          {/* All infomations */}
          {infomationBlock}
        </View>

        <Tabs className="shadow-xl bg-white">
          <TabPanel tab="????????????">
            <View className="p-5 pt-0">
              {_photos?.slice(1)?.map((src) => (
                <Photo key={src} src={src} grey={status === '??????'} />
              ))}
            </View>
          </TabPanel>
          <TabPanel tab="????????????">
            {albums}
            <LLoadMore line={true} show={true} type="end" end-text="?????????" />
          </TabPanel>
          {isAdmin && <TabPanel tab="??????">{historyBlock}</TabPanel>}
        </Tabs>

        {/* ?????????????????????????????? */}
        {imageUploadBlock}
      </Loadable>
    </View>
  );
};

export default CatProfilePage;
