import Avatar from '@/components/avatar';
import { Dispatch } from '@/models/store';
import { ApiRequest } from '@/typings/interfaces';
import { showToast, View } from '@remax/wechat';
import * as React from 'react';
import { useDispatch } from 'react-redux';

const Request = (props: { req: ApiRequest }) => {
  const { updateRequestAsync } = useDispatch<Dispatch>().users;
  const { req } = props;
  const { _id, requestType, applicant } = req;
  const { nickName, avatarUrl } = applicant;

  const userInfo = (
    <View className="flex flex-col text-center">
      <Avatar src={avatarUrl} className="w-10 h-10" />
      <View>{nickName}</View>
    </View>
  );
  return (
    <View className="p-5 flex">
      <View>{userInfo}</View>
      {requestType === 'imageUpload' && <View>some image</View>}
      <View className="flex flex-col">
        <View
          className="bg-blue-200"
          onClick={() => {
            console.log('approve', _id);
            updateRequestAsync({
              requestId: _id,
              action: 'approve'
            })
              .then(() => showToast({ title: '成功' }))
              .catch(() => showToast({ title: '失败', icon: 'error' }));
          }}
        >
          同意
        </View>
        <View
          className="bg-blue-200 mt-2"
          onClick={() => {
            console.log('deny', _id);
            updateRequestAsync({
              requestId: _id,
              action: 'deny'
            })
              .then(() => showToast({ title: '成功' }))
              .catch(() => showToast({ title: '失败', icon: 'error' }));
          }}
        >
          拒绝
        </View>
      </View>
    </View>
  );
};

export default Request;
