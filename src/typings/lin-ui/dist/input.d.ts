import { ComponentType } from 'react';
declare const LInput: ComponentType<{
  label?: string, // 表单标题（label）的文本
  'hide-label'?: boolean, // 隐藏表单标题（label）的文本
  width?: number, // 表单的宽,单位是rpx
  required?: boolean, // 是否必选
  type?:  'text' | 'idcard' | 'digit' | 'password' | 'number'; // 输入框类型，可选值为 text，idcard，digit，password，number	
  value?: string, // 输入框的值
  placeholder?: string; // 占位
  clear?: boolean; // 是否显示清除按钮
  maxlength?: number; // 最大输入长度，设置为 -1 的时候不限制最大长度
  bindlininput?: (event: { detail: { value: string }}) => any; // 输入时回调
}>;
export default LInput;