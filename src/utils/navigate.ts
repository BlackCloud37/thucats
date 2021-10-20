import { navigateTo as wxNavigateTo } from '@remax/wechat';
export const navigateTo = (url: string) => {
  console.debug(`navigate to ${url}`);
  wxNavigateTo({
    url
  }).catch((err) => {
    console.error(err);
    wxNavigateTo({
      url: '/pages/404/index'
    });
  });
};
