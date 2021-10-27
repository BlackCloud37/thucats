import { getStorage, setStorage, removeStorage } from 'remax/wechat';

const createStorage = () => {
  return {
    getItem: (key: string) => {
      console.log('getItem');
      return new Promise((resolve, _reject) => {
        resolve(getStorage({ key }));
      });
    },
    setItem: (key: string, item: any) => {
      console.log('setItem', JSON.stringify(item, null, '\t'));
      return new Promise((resolve, _reject) => {
        resolve(setStorage({ key, data: item }));
      });
    },
    removeItem: (key: string) => {
      console.log('removeItem');
      return new Promise((resolve, _reject) => {
        resolve(removeStorage({ key }));
      });
    }
  };
};

export default createStorage();
