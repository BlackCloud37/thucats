export * from './cat';
export * from './user';
export * from './request';
export * from './controllers';

export type REQUEST_COLLECTION_NAME = 'requests';
export type USER_COLLECTION_NAME = 'users';
export type Collections = USER_COLLECTION_NAME | REQUEST_COLLECTION_NAME | 'cats';
