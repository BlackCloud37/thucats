import * as React from 'react';
import { View, getUserProfile, Text } from 'remax/wechat';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/models/store';
import Avatar from '@/components/avatar';
import { Tabs, TabPanel } from '@/components/tabs';
import TabBar from '@/components/tabbar';
import Request from './request';
import { ApiRequest } from '@/typings/interfaces';
import { Button } from 'annar';
import InfoItem from '@/components/info-item';

const ReqList = ({ reqs }: { reqs: ApiRequest[] }) => {
  return reqs?.length ? (
    <>
      {reqs.map((req) => (
        <Request key={req._id} req={req} />
      ))}
    </>
  ) : (
    <Text>这里空空如也</Text>
  );
};

const ProfilePage = () => {
  const { avatarUrl, nickName, imageRequests, isLoggedin, isAdmin, name, department } = useSelector(
    (state: RootState) => ({
      ...state.users.user,
      ...state.users
    })
  );

  const { loginAsync, getRequestsAsync, getMyRequestsAsync } = useDispatch<Dispatch>().users;

  React.useEffect(() => {
    isAdmin && getRequestsAsync();
  }, [isAdmin]);

  React.useEffect(() => {
    isLoggedin && loginAsync({});
    isLoggedin && getMyRequestsAsync({});
  }, [isLoggedin]);

  // events
  // 登录授权
  const getProfileAndLogin = () => {
    getUserProfile({
      desc: '获取你的昵称、头像'
    }).then((result) => {
      loginAsync(result.userInfo).catch(console.error);
    });
  };

  return (
    <>
      <View className="p-5">
        <View className="rounded-lg shadow-2xl bg-white p-5 flex-col items-center flex text-center mb-5 gap-1">
          {isLoggedin && (
            <>
              <View>
                <Avatar src={avatarUrl} className="w-20 h-20 rounded-full" />
                <View>{nickName}</View>
              </View>
              <View className="w-full flex flex-row flex-wrap items-start">
                <InfoItem field="姓名" val={name} />
                <InfoItem field="部门" val={department} />
              </View>
            </>
          )}

          <Button shape="square" onTap={getProfileAndLogin}>
            {isLoggedin ? '刷新信息' : '点击授权'}
          </Button>
        </View>
        {isAdmin && (
          <Tabs className="bg-white shadow-2xl">
            <TabPanel tab="图片审核">
              <View className="p-5 flex flex-col rounded-lg bg-white">
                <ReqList reqs={imageRequests} />
              </View>
            </TabPanel>
          </Tabs>
        )}
      </View>
      <TabBar />
    </>
  );
};

export default ProfilePage;
