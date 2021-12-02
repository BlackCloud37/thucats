export const RESCUE_SCHEMA: any[] = [
  {
    type: 'str',
    name: 'owner',
    label: '负责人',
    rules: [{ required: true, message: '请填写负责人姓名' }],
    placeholder: '负责人姓名'
  },
  {
    type: 'str',
    name: 'contact',
    label: '联系方式',
    placeholder: '医院联系方式'
  },
  {
    type: 'str',
    name: 'location',
    label: '地址',
    placeholder: '医院所在地'
  },
  {
    type: 'date',
    name: 'startDate',
    label: '开始日期'
  },
  {
    type: 'enum',
    name: 'priority',
    label: '优先级',
    range: ['低', '中', '高']
  },
  {
    type: 'str',
    name: 'detail',
    label: '备注'
  },
  {
    type: 'str',
    name: 'hospitalName',
    label: '医院名字'
  },
  {
    type: 'num',
    name: 'dueRemainDays',
    label: '预计天数',
    placeholder: '预计住院天数'
  }
];

export const FOSTER_SCHEMA: any[] = [
  {
    type: 'str',
    name: 'owner',
    label: '负责人',
    rules: [{ required: true, message: '请填写负责人姓名' }],
    placeholder: '负责人姓名'
  },
  {
    type: 'str',
    name: 'contact',
    label: '寄养人',
    placeholder: '寄养人联系方式'
  },
  {
    type: 'str',
    name: 'location',
    label: '地址',
    placeholder: '寄养人所在地'
  },
  {
    type: 'date',
    name: 'startDate',
    label: '开始日期'
  },
  {
    type: 'enum',
    name: 'priority',
    label: '优先级',
    range: ['低', '中', '高']
  },
  {
    type: 'str',
    name: 'detail',
    label: '备注'
  },
  {
    type: 'bool',
    name: 'postPosted',
    label: '已发领养贴'
  }
];
