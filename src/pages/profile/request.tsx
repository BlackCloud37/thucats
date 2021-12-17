import Avatar from '@/components/avatar';
import { Dispatch } from '@/models/store';
import { ApiRequest } from '@/typings/interfaces';
import { View, showToast } from '@remax/wechat';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'annar';
import Album from '@/components/album';

const Request = (props: { req: ApiRequest }) => {
  const { updateRequestAsync } = useDispatch<Dispatch>().users;
  const { req } = props;
  const { _id, applicant, requestType, imageUploadInfo } = req;
  const { filePaths, catName } = imageUploadInfo ?? {};
  const { nickName, avatarUrl } = applicant;

  const updateRequest = (action: 'approve' | 'deny') => {
    console.log(action, _id);
    updateRequestAsync({
      requestId: _id,
      action
    }).then(() =>
      showToast({
        title: '操作成功',
        icon: 'success'
      }).catch(() =>
        showToast({
          title: '操作失败',
          icon: 'error'
        })
      )
    );
  };

  return (
    <View className="flex flex-col">
      <View className="flex h-16 flex-row items-center ">
        <View className="flex h-12 w-12 items-center justify-center bg-blue-200">
          <Avatar src={avatarUrl} className="w-12 h-12" />
        </View>
        <View className="flex flex-col h-14  flex-grow justify-between">
          <View className="flex flex-row justify-center">{nickName}</View>
          <View className="flex flex-row justify-around">
            <Button shape="square" onTap={() => updateRequest('approve')}>
              同意
            </Button>
            <Button shape="square" onTap={() => updateRequest('deny')}>
              拒绝
            </Button>
          </View>
        </View>
      </View>

      {requestType === 'imageUpload' && (
        <View className="w-full flex flex-col">
          <View>猫咪: {catName}</View>
          <Album urls={filePaths ?? []} />
        </View>
      )}
    </View>
  );
};

export default Request;
