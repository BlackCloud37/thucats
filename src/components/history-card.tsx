import { View, Image, showToast } from '@remax/wechat';
import * as React from 'react';
import { History } from '@/typings/db/history';
import InfoItem from './info-item';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { Button } from 'annar';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@/models/store';

const HistoryCard = (props: { history: History; showIcon?: boolean; catID?: string }) => {
  const { finishLastHistoryAsync } = useDispatch<Dispatch>().cats;

  const { history, showIcon = false, catID } = props;
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
    postPosted,
    isDone
  } = history;
  // TODO: 时轴展示
  const duraDays = Math.max(dayjs().diff(startDate, 'days'), 0);
  return (
    <View className="mt-2">
      <View
        className="rounded-lg mb-1 flex flex-wrap relative pl-2 w-full"
        style={{ minHeight: '8rem' }}
      >
        {showIcon && (
          <Image
            src={historyType === '寄养' ? '/images/house.png' : '/images/rescue.png'}
            className="absolute right-0 top-0 opacity-10 w-32 h-32"
          />
        )}
        <Image
          src={isDone ? '/images/done.svg' : '/images/progressing.svg'}
          className="absolute right-0 top-0 w-10 h-10"
        />
        <View
          className={classNames('absolute -left-1 top-2 h-full rounded-l w-2', {
            'bg-red-200': priority === '高',
            'bg-yellow-200': priority === '中',
            'bg-green-100': !priority || priority === '低'
          })}
        />

        <View className="text-sm font-semibold w-full pt-2">
          {dayjs(startDate).format('YYYY年MM月DD日')}
        </View>
        {/* <InfoItem val={dayjs(startDate).format('YYYY/MM/DD')} field="开始日期" /> */}
        {duraDays >= 0 && <InfoItem val={duraDays} field="已持续(天)" />}

        <InfoItem val={dueRemainDays} field="预计住院时长" />
        <InfoItem val={owner} field="负责人" />

        <InfoItem val={hospitalName} field="所在医院" />
        <InfoItem val={postPosted ? '已发' : '未发'} field="领养贴" />
        <InfoItem val={location} field="所在地点" />

        <InfoItem
          val={contact}
          field={`${historyType === '寄养' ? '寄养' : '医院'}联系方式`}
          full
        />
        <InfoItem val={detail} field="备注" full />
        {!isDone && catID && (
          <Button
            style={{ margin: 'auto' }}
            type="primary"
            onTap={() => {
              finishLastHistoryAsync({ _id: catID })
                .then(() =>
                  showToast({
                    title: '操作成功',
                    icon: 'success'
                  })
                )
                .catch(() => {
                  showToast({
                    title: '操作失败',
                    icon: 'error'
                  });
                });
            }}
          >
            标记为完成
          </Button>
        )}
      </View>
    </View>
  );
};

export default HistoryCard;
