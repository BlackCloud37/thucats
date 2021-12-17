import { Text, View } from '@remax/wechat';
import * as React from 'react';
import classNames from 'classnames';
import Clipable from '@/components/clipable';
import { Button, Picker, Input } from 'annar';
import isNil from 'lodash.isnil';
import toString from 'lodash.tostring';

const InfoItem = <T,>({
  field,
  val,
  full = false,
  clipable = false,
  editable = false,
  range,
  hide = false,
  onEdit
}: {
  field: string;
  val: number | string | undefined;
  full?: boolean;
  clipable?: boolean;
  editable?: boolean;
  range?: readonly T[];
  hide?: boolean;
  onEdit?: (value: T) => void; // callback
}) => {
  if (hide) {
    return null;
  }
  const strVal = toString(val);
  if ((isNil(val) || strVal.length === 0) && !editable) {
    return null;
  }

  // show
  const content = (
    <Text
      selectable
      className={classNames('block text-sm', { 'underline text-blue-500': clipable })}
    >
      {strVal}
    </Text>
  );
  const showContent = clipable ? <Clipable clipContent={strVal}>{content}</Clipable> : content;

  // edit
  const editContent = range ? (
    <Picker
      range={range as any[]}
      onChange={(index) => {
        const selected = range[index as number];
        selected && onEdit?.(selected);
      }}
    >
      <Button plain shape="square">
        {strVal}
      </Button>
    </Picker>
  ) : (
    // input
    <Input
      onChange={({ target: { value } }) => {
        console.log(value);
        onEdit?.(value);
      }}
      value={strVal}
      className="shadow-inner"
      style={{ borderRadius: '0.5rem' }} // rounded-lg
    />
  );

  return (
    <View className={`flex flex-col ${full ? 'w-full' : 'w-1on2'} font-light mt-4`}>
      <Text className="block text-xs text-gray-500">{field}</Text>
      {editable ? editContent : showContent}
    </View>
  );
};

export default InfoItem;
