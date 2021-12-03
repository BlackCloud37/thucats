import * as React from 'react';
import { Form, Cell, Button, Switch, DatePicker, Radio } from 'annar';

interface FormSchema {
  type: 'str' | 'bool' | 'date' | 'enum' | 'num';
  name: string;
  label: string;
  rules?: any[];
}

interface StringForm extends FormSchema {
  type: 'str';
  placeholder?: string;
}

interface BoolForm extends FormSchema {
  type: 'bool';
}

interface DateForm extends FormSchema {
  type: 'date';
}

interface EnumForm extends FormSchema {
  type: 'enum';
  range: any[];
}

interface NumberForm extends FormSchema {
  type: 'num';
  placeholder?: string;
}

const FormItem = (props: { schema: FormSchema }) => {
  const { schema } = props;
  const { type } = schema;
  const { name, label, rules } = schema;
  if (type === 'str') {
    const { placeholder } = schema as StringForm;
    return (
      <Form.Item border={false} noStyle name={name} rules={rules}>
        <Cell.Input label={label} placeholder={placeholder ?? '请输入'} />
      </Form.Item>
    );
  } else if (type === 'num') {
    const { placeholder } = schema as NumberForm;
    return (
      <Form.Item border={false} noStyle name={name} rules={rules}>
        <Cell.Input type="number" label={label} placeholder={placeholder ?? '请输入'} />
      </Form.Item>
    );
  } else if (type === 'bool') {
    return (
      <Form.Item label={label} name={name} valuePropName="checked" valueAlign="left" rules={rules}>
        <Switch small />
      </Form.Item>
    );
  } else if (type === 'date') {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <DatePicker type="date">{(v: any) => v}</DatePicker>
      </Form.Item>
    );
  } else if (type === 'enum') {
    const { range } = schema as EnumForm;
    if (!range?.length) {
      return null;
    }
    return (
      <Form.Item name={name} label={label} rules={rules}>
        <Radio.Group>
          {range?.map((v) => (
            <Radio key={v} value={v}>
              {v}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    );
  }
  return null;
};

const UniForm = (props: {
  schemas: (StringForm | BoolForm | DateForm | EnumForm | NumberForm)[];
  onFinish?: any;
  onFail?: any;
  onCancel?: any;
}) => {
  const { schemas, onFail, onFinish, onCancel } = props;
  if (!schemas?.length) {
    return null;
  }

  const [form] = Form.useForm();
  return (
    <Form onFinish={onFinish} onFinishFailed={onFail}>
      {schemas.map((s) => (
        <FormItem key={s?.name} schema={s} />
      ))}
      <Form.Item noStyle style={{ marginTop: 20, padding: '0 20px' }}>
        <Button
          type="primary"
          size="large"
          shape="square"
          block
          nativeType="submit"
          onTap={() => form.submit()}
        >
          提交
        </Button>
      </Form.Item>
      <Form.Item noStyle style={{ marginTop: 20, padding: '0 20px' }}>
        <Button size="large" shape="square" block onTap={onCancel}>
          取消
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UniForm;
