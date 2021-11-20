import { DbUser, USER_COLLECTION_NAME } from '@/typings/db';

export async function getCurrentUser(): Promise<DbUser | undefined> {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  return getUserByOpenid(openid);
}

export async function getUserByOpenid(openid: string): Promise<DbUser | undefined> {
  const {
    data: [user]
  } = await db
    .collection(USER_COLLECTION_NAME)
    .where({
      openid
    })
    .get();
  console.log('get user by openid', user);
  return user;
}
