import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading';
import createRematchPersist from '@rematch/persist';
import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import { models, RootModel } from './models';
import storage from '@/utils/storage';

type FullModel = ExtraModelsFromLoading<RootModel>;

const persistPlugin = createRematchPersist({
  whitelist: ['users', 'cats'],
  throttle: 1000,
  version: 2,
  key: 'root',
  storage
});

export const store = init<RootModel, FullModel>({
  models,
  // @ts-ignore
  plugins: [loadingPlugin(), persistPlugin]
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel, FullModel>;
