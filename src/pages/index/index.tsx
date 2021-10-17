import { Dispatch, RootState } from '@/models/store';
import { UserState } from '@/models/users';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Image } from 'remax/wechat';
import styles from './index.css';

const Index = () => {
  const { openid, loading } = useSelector((state: RootState) => ({
    openid: state.users.openid,
    loading: state.loading.effects.users.fetchOpenidAsync // true when `fetchOpenidAsync` is running
  }));
  const dispatch = useDispatch<Dispatch>();
  React.useEffect(() => {
    dispatch.users.fetchOpenidAsync();
  }, []);

  return (
    <View className={styles.app}>
      <View className={styles.header}>
        <Image
          src="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ"
          className={styles.logo}
        />
        {loading ? (
          <View className={styles.text}>Loading</View>
        ) : (
          <View className={styles.text}>OpenID: {openid}</View>
        )}
      </View>
    </View>
  );
};

export default Index;
