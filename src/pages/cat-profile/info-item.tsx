import { Text, View } from '@remax/wechat';
import * as React from 'react';
import classNames from 'classnames';
import Clipable from '@/components/clipable';
import 'annar/esm/picker/style/css';
import 'annar/esm/input/style/css';
import 'annar/esm/button/style/css';
import { Button, Picker, Input } from 'annar';

const InfoItem = <T,>({
  field,
  val,
  full = false,
  clipable = false,
  editable = false,
  range,
  onEdit
}: {
  field: string;
  val: string | undefined;
  full?: boolean;
  clipable?: boolean;
  editable?: boolean;
  range?: readonly T[];
  onEdit?: (value: T) => void; // callback
}) => {
  if (!val && !editable) {
    return null;
  }
  // show
  const content = (
    <Text
      selectable
      className={classNames('block text-sm', { 'underline text-blue-500': clipable })}
    >
      {val}
    </Text>
  );
  const showContent = clipable ? <Clipable clipContent={val!}>{content}</Clipable> : content;

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
        {val}
      </Button>
    </Picker>
  ) : (
    // input
    <Input
      onChange={({ target: { value } }) => {
        console.log(value);
        onEdit?.(value);
      }}
      value={val}
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
