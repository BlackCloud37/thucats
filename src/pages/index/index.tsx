import { Dispatch, RootState } from '@/models/store';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'remax/wechat';
import LButton from '@/typings/lin-ui/dist/button';
import styles from './index.css';
import { navigateTo } from '@/utils';

const Index = () => {
  const { openid, loading } = useSelector((state: RootState) => ({
    openid: state.users.openid,
    loading: state.loading.effects.users.fetchOpenidAsync // true when `fetchOpenidAsync` is running
  }));
  const dispatch = useDispatch<Dispatch>();
  const { fetchOpenidAsync } = dispatch.users;

  return (
    <View className={styles.app}>
      <View className={styles['nav-card-container']}>
        <View onClick={() => navigateTo('/pages/unknown/index')}>图鉴</View>
        <View onClick={() => navigateTo('/pages/unknown/index')}>x</View>
        <View onClick={() => navigateTo('/pages/unknown/index')}>x</View>
        <View onClick={() => navigateTo('/pages/unknown/index')}>x</View>
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
