import { Dispatch, RootState } from '@/models/store';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Image } from 'remax/wechat';
import LButton from 'lin-ui/dist/button';
import styles from './index.css';

const Index = () => {
  const { openid, loading } = useSelector((state: RootState) => ({
    openid: state.users.openid,
    loading: state.loading.effects.users.fetchOpenidAsync // true when `fetchOpenidAsync` is running
  }));
  const dispatch = useDispatch<Dispatch>();
  const { fetchOpenidAsync } = dispatch.users;

  return (
    <View className={styles.app}>
      <View className={styles.header}>
        <Image
          src="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ"
          className={styles.logo}
        />
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
