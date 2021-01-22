import { AppModuleType } from "./modules/app/types";

export type RootState = {};

type StoreModules = {
  app: AppModuleType;
};

export type Store = AppModuleType<Pick<StoreModules, "app">>;
