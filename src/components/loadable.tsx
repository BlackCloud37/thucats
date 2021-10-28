import * as React from 'react';
import { View } from 'remax/wechat';

const Loadable = ({
  children,
  loading,
  loader = <View>Loading</View>
}: {
  children: any;
  loading: boolean;
  loader?: any;
}) => {
  if (loading) return loader;
  return children;
};
export default Loadable;
