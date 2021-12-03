import { View } from '@remax/wechat';
import * as React from 'react';
import { History } from '@/typings/db/history';
import InfoItem from './info-item';
import dayjs from 'dayjs';
import classNames from 'classnames';

const HistoryCard = (props: { history: History }) => {
  const { history } = props;
  const { priority, owner, contact, detail, startDate, dueRemainDays } = history;
  const duraDays = Math.max(dayjs().diff(startDate, 'days'), 0);
  return (
    <View className="rounded-lg mt-1 mb-1 flex flex-wrap relative pl-2">
      <View
        className={classNames('absolute left-0 top-2 h-full rounded-l w-1', {
          'bg-red-200': priority === '高',
          'bg-yellow-200': priority === '中',
          'bg-blue-200': !priority || priority === '低'
        })}
      />
      <InfoItem val={owner} field="负责人" />
      <InfoItem val={`${priority}`} field="优先级" />

      <InfoItem val={dayjs(startDate).format('YYYY-MM-DD')} field="开始日期" />
      <InfoItem val={`${dueRemainDays}`} field="预计住院时长" />

      {!!duraDays && <InfoItem val={`${duraDays}`} field="已持续(天)" />}

      <InfoItem val={contact} field="联系方式" />
      <InfoItem val={detail} field="详情" />
    </View>
  );
};

export default HistoryCard;
