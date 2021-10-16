import { Dispatch, RootState } from '@/models/store';
import { UserState } from '@/models/users';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Image } from 'remax/wechat';
import styles from './index.css';

const Index = () => {
  const userState: UserState = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<Dispatch>();
  const { openid } = userState;
  React.useEffect(() => {
    dispatch.users.fetchOpenidAsync().then();
  }, []);

  return (
    <View className={styles.app}>
      <View className={styles.header}>
        <Image
          src="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ"
          className={styles.logo}
        />
        <View className={styles.text}>OpenID: {openid}</View>
      </View>
    </View>
  );
};

export default Index;
