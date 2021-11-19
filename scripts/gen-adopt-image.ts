const displayKeys = [
  ['name', '姓名'],
  ['colorDescription', '毛色'],
  ['sex', '性别'],
  ['healthDescription', '健康/免疫'],
  ['adoptDescription', '领养简介']
];

const parseContent = (s: string): string => {
  // TODO: parse grammar like: **** ** ~~
  return s;
};

const getInfoHtml = (cat: any) => {
  // TODO: check non-null value
  const infoLines = displayKeys
    .filter(([key]) => {
      return !!cat[key]?.length;
    })
    .map(([key, displayKey]) => {
      return `<div><span class="title">${displayKey}: </span>${parseContent(cat[key])}`;
    });
  const contactLine = `<div class="contact title">领养联系: ${cat.adoptContact}</div>`;
  return `<div class="info">${infoLines.join('')}${contactLine}</div>`;
};

export const getFullHtml = (cat: any) => {
  return `
    <div class="container">
      <img src="${cat.adoptPhoto}" />
      ${getInfoHtml(cat)}
      <img src="https://7468-thucats-3grq39dr7a44e550-1307824186.tcb.qcloud.la/resources/adopt-image/guide.jpeg?sign=abc8c1311bc18ce96d151f9714f856fd&t=1637340248" />
    </div>
  `;
};

const testCat = {
  name: '白桃',
  sex: '母',
  colorDescription: '橘白，身体白尾巴橘耶～',
  healthDescription: '已绝育/已驱虫',
  adoptDescription:
    '白桃是一只圆滚滚的橘白猫，当她趴在车后座或者人们怀里的时候就变成了真·白桃形状。白桃是一只圆滚滚的橘白猫，当她趴在车后座或者人们怀里的时候就变成了真·白桃形状。白桃是一只圆滚滚的橘白猫，当她趴在车后座或者人们怀里的时候就变成了真·白桃形状。',
  adoptContact: '17550139697',
  adoptPhoto: 'https://i.hongfs.cn/88kA'
};

export const css = `
.container {
  width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.info {
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: rgb(250, 246, 234);
  font-size: 50px;
}
img {
  width: 100%;
}
.title {
  color: red;
}
.contact {
text-align: center
}`;

console.log(getFullHtml(testCat));
