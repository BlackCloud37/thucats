import * as React from 'react';
import { View, getUserProfile, Text, showToast } from 'remax/wechat';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/models/store';
import Avatar from '@/components/avatar';
import { Tabs, TabPanel } from '@/components/tabs';
import Request from './request';
import { ApiRequest } from '@/typings/interfaces';
/* Form Example Import Used Components and Their Styles */
import { Form, Card, Cell, Button } from 'annar';
import 'annar/esm/card/style/css';
import 'annar/esm/form/style/css';
import 'annar/esm/cell/style/css';
import 'annar/esm/radio/style/css';
import 'annar/esm/button/style/css';
import 'annar/esm/row/style/css';
import 'annar/esm/col/style/css';
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
  const [clickCnt, setClickCnt] = React.useState(0);

  const { loginAsync, getRequestsAsync, createRequestAsync } = useDispatch<Dispatch>().users;

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

  const [requesting, setRequesting] = React.useState(false);
  /* Form Example Callback Funcs */
  const [form] = Form.useForm();
  const handleFinish = (values: any) => {
    console.log('values', values);
    createRequestAsync({
      requestType: 'permission',
      // TODO: 表单

      permissionInfo: values
    })
      .then(() => showToast({ title: '成功' }))
      .catch(() => showToast({ title: '失败' }));
    setRequesting(!requesting);
  };
  const handleFinishFailed = (values: any, errorFields: any) => {
    console.log('errorFields', errorFields);
  };
  const handleSubmit = () => {
    form.submit();
  };
  // 申请权限
  // const requestPermission = () => {
  //   createRequestAsync({
  //     requestType: 'permission'
  //     // TODO: 表单

  //     // permissionInfo: {}
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
        {clickCnt >= 5 && !requesting && (
          <Button
            shape="square"
            onTap={() => {
              if (requesting) {
                // requestPermission();
              }
              setRequesting(!requesting);
            }}
          >
            申请权限
          </Button>
        )}
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
      {requesting && (
        <Card contentStyle={{ padding: '20px 0 20px' }}>
          <Form onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
            <Form.Item noStyle name="name" rules={[{ required: true, message: '姓名不可为空' }]}>
              <Cell.Input label="姓名" placeholder="请输入" border={false} />
            </Form.Item>
            <Form.Item
              noStyle
              name="schoolID"
              rules={[{ pattern: /\d{10}/, message: '学号不符合规范（10位）' }]}
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
                onTap={handleSubmit}
              >
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </View>
  );
};

export default ProfilePage;
