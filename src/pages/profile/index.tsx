import * as React from 'react';
import { View, getUserProfile } from 'remax/wechat';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/models/store';

const ProfilePage = () => {
  const { avatarUrl, nickName, roles } = useSelector((state: RootState) => ({
    ...state.users.user
    // loading: state.loading.effects.settings.fetchSettingsAsync
  }));

  const { loginAsync, checkPermission } = useDispatch<Dispatch>().users;
  React.useEffect(() => {
    console.log(checkPermission({ requiredRole: 'operator' }));
  }, []);

  return (
    <View className="p-5">
      {nickName && (
        <View>
          <View>{nickName}</View>
          <View>{avatarUrl}</View>
          <View>{roles}</View>
        </View>
      )}
      <View
        className="bg-blue-200"
        onClick={() => {
          getUserProfile({
            desc: '获取你的昵称、头像'
          }).then((result) => {
            console.log(result);
            loginAsync({ userInfo: result.userInfo }).catch(console.error);
          });
        }}
      >
        {nickName ? '刷新个人信息' : '点击授权'}
      </View>
    </View>
  );
};

export default ProfilePage;
