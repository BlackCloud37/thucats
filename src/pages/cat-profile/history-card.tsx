import { View, Image } from '@remax/wechat';
import * as React from 'react';
import { History } from '@/typings/db/history';
import InfoItem from './info-item';
import dayjs from 'dayjs';
import classNames from 'classnames';

const HistoryCard = (props: { history: History; showIcon?: boolean }) => {
  const { history, showIcon = false } = props;
  const {
    priority,
    owner,
    contact,
    detail,
    startDate,
    dueRemainDays,
    historyType,
    location,
    hospitalName,
    // postImageURL,
    postPosted
    // isDone
  } = history;
  const duraDays = Math.max(dayjs().diff(startDate, 'days'), 0);
  return (
    <View
      className="rounded-lg mt-1 mb-1 flex flex-wrap relative pl-2 w-full"
      style={{ minHeight: '8rem' }}
    >
      {showIcon && (
        <Image
          src={historyType === '寄养' ? '/images/house.png' : '/images/rescue.png'}
          className="absolute right-0 top-0 opacity-10 w-32 h-32"
        />
      )}
      <View
        className={classNames('absolute -left-1 top-2 h-full rounded-l w-2', {
          'bg-red-200': priority === '高',
          'bg-yellow-200': priority === '中',
          'bg-green-100': !priority || priority === '低'
        })}
      />
      <InfoItem val={dayjs(startDate).format('YYYY/MM/DD')} field="开始日期" />
      {duraDays > 0 && <InfoItem val={duraDays} field="已持续(天)" />}

      <InfoItem val={dueRemainDays} field="预计住院时长" />
      <InfoItem val={owner} field="负责人" />

      <InfoItem val={hospitalName} field="所在医院" />
      <InfoItem val={location} field="所在地点" />

      <InfoItem val={contact} field={`${historyType === '寄养' ? '寄养' : '医院'}联系方式`} full />
      <InfoItem val={detail} field="备注" full />
    </View>
  );
};

export default HistoryCard;
