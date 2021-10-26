import { CatProfilePayload } from '@/pages/cat-profile';
import { navigateTo as wxNavigateTo } from '@remax/wechat';

export type Pages = 'index' | 'cat-list' | 'cat-profile' | '404';
/* 
   跳转到目标页面，并附带payload作为参数
   payload在目标页面中onLoad的option中取出
   例：
   - 跳转前：navigateTo('pages/cat-profile/index', { name: "咪咪" })
   - `cat-profile`页：
        usePageEvent('onLoad', ({ payload }) => {
          const data = JSON.stringify(payload);
          assert(data.name === "咪咪")
        })

   跳转失败时自动到404
   修改页面时，需要维护参数
 */

export function navigateTo<P extends Pages>(
  page: P,
  payload?: P extends 'cat-profile' ? CatProfilePayload : never
) {
  const url = `/pages/${page}/index`;
  console.log(`navigate to ${url}`);
  console.log(`payload ${JSON.stringify(payload)}`);

  let urlWithParams = url;
  if (payload !== null) {
    urlWithParams = `${url}?payload=${JSON.stringify(payload)}`;
  }

  wxNavigateTo({
    url: urlWithParams
  }).catch((err) => {
    console.error(err);
    wxNavigateTo({
      url: '/pages/404/index'
    });
  });
}
