import * as React from 'react';
import { View, getUserProfile, Text } from 'remax/wechat';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/models/store';
import Avatar from '@/components/avatar';
import { Tabs, TabPanel } from '@/components/tabs';
import Request from './request';
import { ApiRequest } from '@/typings/interfaces';
import { Button } from 'annar';
import 'annar/esm/button/style/css';
const ProfilePage = () => {
  const {
    avatarUrl,
    nickName,
    permissionRequests,
    imageRequests,
    isLoggedin,
    isOperator,
    isAdmin
  } = useSelector((state: RootState) => ({
    ...state.users.user,
    ...state.users
    // loading: state.loading.effects.settings.fetchSettingsAsync
  }));

  const { loginAsync, getRequestsAsync /* createRequestAsync */ } = useDispatch<Dispatch>().users;

  React.useEffect(() => {
    isOperator && getRequestsAsync();
  }, [isOperator]);

  console.log(permissionRequests, imageRequests);

  React.useEffect(() => {});

  // events
  // 登录授权
  const getProfileAndLogin = () => {
    getUserProfile({
      desc: '获取你的昵称、头像'
    }).then((result) => {
      console.log(result);
      loginAsync(result.userInfo).catch(console.error);
    });
  };

  // 申请权限
  // const requestPermission = () => {
  //   createRequestAsync({
  //     requestType: 'permission'
  //   })
  //     .then(() => showToast({ title: '成功' }))
  //     .catch(() => showToast({ title: '失败' }));
  // };

  const reqList = (reqs: ApiRequest[]) => {
    return reqs?.length ? (
      reqs.map((req) => <Request key={req._id} req={req} />)
    ) : (
      <Text>这里空空如也</Text>
    );
  };
  return (
    <View className="p-5">
      <View className="rounded-lg shadow-2xl bg-white p-5 flex-col items-center flex text-center mb-5">
        {isLoggedin && (
          <View>
            <Avatar src={avatarUrl} className="w-20 h-20 rounded-full" />
            <View>{nickName}</View>
          </View>
        )}
        <Button shape="square" onTap={getProfileAndLogin}>
          {isLoggedin ? '刷新信息' : '点击授权'}
        </Button>
        {/* {!isOperator && <LButton bindlintap={requestPermission}>申请权限</LButton>} */}
      </View>
      {isOperator && (
        <Tabs className="bg-white shadow-2xl">
          {isAdmin && (
            <TabPanel tab="权限审批">
              <View className="p-5 flex flex-col rounded-lg">{reqList(permissionRequests)}</View>
            </TabPanel>
          )}
          {/* {isOperator && (
            <TabPanel tab="图片审核">
              <View className="p-5 flex flex-col rounded-lg bg-white">
                {reqList(imageRequests)}
              </View>
            </TabPanel>
          )} */}
        </Tabs>
      )}
    </View>
  );
};

export default ProfilePage;
