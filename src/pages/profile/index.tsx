import * as React from 'react';
import { View, getUserProfile, Text, showToast } from 'remax/wechat';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/models/store';
import Avatar from '@/components/avatar';
import { Tabs, TabPanel } from '@/components/tabs';
import TabBar from '@/components/tabbar';
import Request from './request';
import { ApiRequest } from '@/typings/interfaces';
import { Card, Button } from 'annar';
import UniForm from '@/components/uni-form';
import InfoItem from '@/components/info-item';

const ProfilePage = () => {
  const {
    avatarUrl,
    nickName,
    permissionRequests,
    imageRequests,
    isLoggedin,
    isOperator,
    isAdmin,
    imageUploadCount
  } = useSelector((state: RootState) => ({
    ...state.users.user,
    ...state.users
    // loading: state.loading.effects.settings.fetchSettingsAsync
  }));
  const [clickCnt, setClickCnt] = React.useState(0);

  const { loginAsync, getRequestsAsync, createRequestAsync, getMyRequestsAsync } =
    useDispatch<Dispatch>().users;

  React.useEffect(() => {
    isOperator && getRequestsAsync();
  }, [isOperator]);

  React.useEffect(() => {
    isLoggedin && loginAsync({});
    isLoggedin && getMyRequestsAsync({});
  }, [isLoggedin]);

  const reqList = (reqs: ApiRequest[]) => {
    return reqs?.length ? (
      reqs.map((req) => <Request key={req._id} req={req} />)
    ) : (
      <Text>这里空空如也</Text>
    );
  };

  // events
  // 登录授权
  const getProfileAndLogin = () => {
    getUserProfile({
      desc: '获取你的昵称、头像'
    }).then((result) => {
      loginAsync(result.userInfo).catch(console.error);
    });
  };

  const [editingForm, setEditingForm] = React.useState(false);
  const handleFinish = (permissionInfo: any) => {
    createRequestAsync({
      requestType: 'permission',
      permissionInfo
    })
      .then(() => showToast({ title: '成功' }))
      .catch(() => showToast({ title: '失败' }))
      .finally(() => {
        setEditingForm(!editingForm);
      });
  };

  return (
    <>
      <View className="p-5">
        <View className="rounded-lg shadow-2xl bg-white p-5 flex-col items-center flex text-center mb-5 gap-1">
          {isLoggedin && (
            <View onClick={() => setClickCnt((cnt) => cnt + 1)}>
              <Avatar src={avatarUrl} className="w-20 h-20 rounded-full" />
              <View>{nickName}</View>
            </View>
          )}
          <InfoItem field="图片上传数" val={imageUploadCount ?? 0} />
          <Button shape="square" onTap={getProfileAndLogin}>
            {isLoggedin ? '刷新信息' : '点击授权'}
          </Button>
          {!isOperator && clickCnt >= 5 && !editingForm && (
            <Button shape="square" onTap={() => setEditingForm(!editingForm)}>
              申请权限
            </Button>
          )}
        </View>

        {editingForm && (
          <Card contentStyle={{ padding: '20px 0 20px' }} shadow>
            <UniForm
              onFinish={handleFinish}
              schemas={[
                {
                  type: 'str',
                  name: 'name',
                  label: '姓名',
                  rules: [{ required: true, message: '姓名不可为空' }]
                },
                {
                  type: 'str',
                  name: 'schoolID',
                  label: '学号',
                  rules: [{ required: true, message: '学号不可为空' }]
                },
                {
                  type: 'str',
                  name: 'department',
                  label: '部门',
                  rules: [{ required: true, message: '部门不能为空' }]
                }
              ]}
            />
          </Card>
        )}
        {isLoggedin && (
          <Tabs className="bg-white shadow-2xl">
            {isAdmin && (
              <TabPanel tab="权限审批">
                <View className="p-5 flex flex-col rounded-lg">{reqList(permissionRequests)}</View>
              </TabPanel>
            )}
            {/* {!isOperator && (
              <TabPanel tab="我的申请">
                <View className="p-5 flex flex-col rounded-lg">{reqList(myRequests)}</View>
              </TabPanel>
            )} */}
            {isOperator && (
              <TabPanel tab="图片审核">
                <View className="p-5 flex flex-col rounded-lg bg-white">
                  {reqList(imageRequests)}
                </View>
              </TabPanel>
            )}
          </Tabs>
        )}
      </View>
      <TabBar />
    </>
  );
};

export default ProfilePage;
