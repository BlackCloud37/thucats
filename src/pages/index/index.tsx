import { Dispatch, RootState } from '@/models/store';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Image } from 'remax/wechat';
import LButton from 'lin-ui/dist/button';
import styles from './index.css';
import { navigateTo } from '@/utils';
import '@/styles/tailwind.css';

const Index = () => {
  const { openid, loading } = useSelector((state: RootState) => ({
    openid: state.users.openid,
    loading: state.loading.effects.users.fetchOpenidAsync // true when `fetchOpenidAsync` is running
  }));
  const dispatch = useDispatch<Dispatch>();
  const { fetchOpenidAsync } = dispatch.users;

  return (
    <View className={styles.app}>
      <View className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 mt-2">
        <View className="flex-shrink-0">
          <Image className="h-12 w-12 mx-2" src="/icon.png" />
        </View>
        <View>
          <View className="text-xl font-medium text-black text-left">Powered by Remax</View>
          <Text className="text-gray-500">Tailwind test block</Text>
        </View>
      </View>

      <View className={styles['nav-card-container']}>
        <View onClick={() => navigateTo('cat-list')}>图鉴</View>
        <View onClick={() => navigateTo('404')}>x</View>
        <View onClick={() => navigateTo('404')}>x</View>
        <View onClick={() => navigateTo('404')}>x</View>
      </View>
      <LButton
        l-class={styles.button}
        bg-color="black"
        bindlintap={() => {
          fetchOpenidAsync().catch((err) => console.error(err));
        }}
        loading={loading}
        disabled={!!openid}
      >
        {openid ? 'Banned' : loading ? 'Loading' : 'Click me'}
      </LButton>
      {openid && <View className={styles.text}>OpenID: {openid}</View>}
    </View>
  );
};

export default Index;
