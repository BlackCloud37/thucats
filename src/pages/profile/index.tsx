import * as React from 'react';
import { View, getUserProfile, Text, showToast } from 'remax/wechat';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/models/store';
import Avatar from '@/components/avatar';
import { Tabs, TabPanel } from '@/components/tabs';
import Request from './request';
const ProfilePage = () => {
  const { avatarUrl, nickName, roles, permissionRequests, imageRequests } = useSelector(
    (state: RootState) => ({
      ...state.users.user,
      ...state.users
      // loading: state.loading.effects.settings.fetchSettingsAsync
    })
  );

  const [isAdmin, setAdmin] = React.useState(false);
  const [isOperator, setOperator] = React.useState(false);

  const loggedin = !!avatarUrl && !!nickName;
  const { loginAsync, checkPermission, getRequestsAsync, createRequestAsync } =
    useDispatch<Dispatch>().users;

  React.useEffect(() => {
    if (checkPermission({ requiredRole: 'operator' })) {
      setOperator(true);
      getRequestsAsync();
    }
    if (checkPermission({ requiredRole: 'admin' })) {
      setAdmin(true);
    }
  }, [roles?.[0]]);

  console.log(permissionRequests, imageRequests);

  React.useEffect(() => {});
  return (
    <View className="p-5">
      <View className="rounded-lg shadow-2xl bg-white p-5 flex-col items-center flex text-center mb-5">
        {loggedin && (
          <View>
            <Avatar src={avatarUrl} className="w-20 h-20" />
            <View>{nickName}</View>
          </View>
        )}
        <View
          className="bg-blue-200 w-20 h-8 rounded-lg"
          onClick={() => {
            getUserProfile({
              desc: '获取你的昵称、头像'
            }).then((result) => {
              console.log(result);
              loginAsync(result.userInfo).catch(console.error);
            });
          }}
        >
          {nickName ? '刷新信息' : '点击授权'}
        </View>
        <View
          onClick={() => {
            createRequestAsync({
              requestType: 'permission'
            })
              .then(() => showToast({ title: '成功' }))
              .catch(() => showToast({ title: '失败' }));
          }}
        >
          申请权限
        </View>
      </View>
      {isOperator && (
        <Tabs>
          {isAdmin && (
            <TabPanel tab="权限审核">
              <View className="p-5 flex flex-col rounded-lg bg-white">
                {permissionRequests.length ? (
                  permissionRequests.map((req) => <Request key={req._id} req={req} />)
                ) : (
                  <Text>这里空空如也</Text>
                )}
              </View>
            </TabPanel>
          )}
          {isOperator && (
            <TabPanel tab="图片审核">
              <View className="p-5 flex flex-col rounded-lg bg-white">
                {imageRequests.length ? (
                  imageRequests.map((req) => <Request key={req._id} req={req} />)
                ) : (
                  <Text>这里空空如也</Text>
                )}
              </View>
            </TabPanel>
          )}
        </Tabs>
      )}
    </View>
  );
};

export default ProfilePage;
