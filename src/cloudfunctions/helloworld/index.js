// eslint-disable-next-line @typescript-eslint/no-require-imports
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  console.log(event);
  console.log(context);
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  return {
    openid
  }; // result
};
