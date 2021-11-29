import * as React from 'react';
import { View, getUserProfile, Text, showToast } from 'remax/wechat';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/models/store';
import Avatar from '@/components/avatar';
import { Tabs, TabPanel } from '@/components/tabs';
import TabBar from '@/components/tabbar';
import Request from './request';
import { ApiRequest } from '@/typings/interfaces';

import { Form, Card, Cell, Button } from 'annar';
import 'annar/esm/card/style/css';
import 'annar/esm/form/style/css';
import 'annar/esm/cell/style/css';
import 'annar/esm/button/style/css';

const ProfilePage = () => {
  const { avatarUrl, nickName, permissionRequests, isLoggedin, isOperator, isAdmin } = useSelector(
    (state: RootState) => ({
      ...state.users.user,
      ...state.users
      // loading: state.loading.effects.settings.fetchSettingsAsync
    })
  );
  const [clickCnt, setClickCnt] = React.useState(0);

  const { loginAsync, getRequestsAsync, createRequestAsync } = useDispatch<Dispatch>().users;

  React.useEffect(() => {
    isOperator && getRequestsAsync();
  }, [isOperator]);

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
  const [form] = Form.useForm();
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
            <Form onFinish={handleFinish}>
              <Form.Item noStyle name="name" rules={[{ required: true, message: '姓名不可为空' }]}>
                <Cell.Input label="姓名" placeholder="请输入" border={false} />
              </Form.Item>
              <Form.Item
                noStyle
                name="schoolID"
                rules={[{ pattern: /\d{10}/, message: '学号不符合规范（10位）' }]} // TODO: 其他学校的pattern
              >
                <Cell.Input label="学号" placeholder="请输入" border={false} />
              </Form.Item>
              <Form.Item
                noStyle
                name="department"
                rules={[{ required: true, message: '所在部门不可为空' }]}
              >
                <Cell.Input label="所在部门" placeholder="请输入" border={false} />
              </Form.Item>
              <Form.Item noStyle style={{ marginTop: 20, padding: '0 20px' }}>
                <Button
                  type="primary"
                  size="large"
                  shape="square"
                  block
                  nativeType="submit"
                  onTap={() => form.submit()}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
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
      <TabBar />
    </>
  );
};

export default ProfilePage;
