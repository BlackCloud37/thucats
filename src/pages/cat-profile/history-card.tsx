import { View } from '@remax/wechat';
import * as React from 'react';
import { History } from '@/typings/db/history';
import InfoItem from './info-item';
import dayjs from 'dayjs';

const HistoryCard = (props: { history: History }) => {
  const { history } = props;
  return (
    <View className="rounded-lg mt-1 mb-1 flex flex-wrap relative pl-2">
      <View className="absolute left-0 top-2 h-full rounded-l bg-blue-500 w-1" />
      <InfoItem val={history.historyType} field="类型" full />
      <InfoItem val={history.owner} field="负责人" />
      <InfoItem val={dayjs(history.startDate).format('YYYY-MM-DD')} field="开始日期" />
      <InfoItem val={history.contact} field="联系方式" />
      <InfoItem val={`${history.priority}`} field="优先级" />
      <InfoItem val={history.detail} field="详情" />
    </View>
  );
};

export default HistoryCard;
