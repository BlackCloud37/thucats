import { getStorage, setStorage, removeStorage } from 'remax/wechat';

const createStorage = () => {
  return {
    getItem: (key: string) => {
      return new Promise((resolve, _reject) => {
        getStorage({ key })
          .then(({ data }) => {
            resolve(data);
          })
          .catch(console.error);
      });
    },
    setItem: (key: string, item: any) => {
      return new Promise((resolve, _reject) => {
        resolve(setStorage({ key, data: item }));
      });
    },
    removeItem: (key: string) => {
      return new Promise((resolve, _reject) => {
        resolve(removeStorage({ key }));
      });
    }
  };
};

export default createStorage();
