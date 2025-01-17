import type {
  Asset,
  ExchangeRate,
  Snapshot,
  Transaction,
  User
} from "@foxone/mixin-sdk/types";
import {
  ActionContext,
  Store as VuexStore,
  CommitOptions,
  DispatchOptions
} from "vuex";

import { RootState } from "../../types";

export const WalletModulePerfix = "wallet/";

export interface State {
  me: User | null;
  assets: Asset[];
  additionAssets: Asset[];
  exchangeRates: ExchangeRate[];
  snapshots: Snapshot[];
  snapshotsLoaded: boolean;
  transactions: Transaction[];
  users: User[];
}

export const GetterKeys = {
  TOTAL_USD: "TOTAL_USD",
  TOTAL_BTC: "TOTAL_BTC",
  GET_ASSET_BY_ID: "GET_ASSET_BY_ID",
  GET_MERGED_ASSETS: "GET_MERGED_ASSETS"
} as const;

export type Getters = {};

export const MutationTypes = {
  SET_ASSETS: "SET_ASSETS",
  ADD_ADDITION_ASSET: "ADD_ADDITION_ASSET",
  REMVOE_ADDITION_ASSET: "REMVOE_ADDITION_ASSET",
  SET_EXCHANGE_RATE: "SET_EXCHANGE_RATE",
  SET_SNAPSHOTS: "SET_SNAPSHOTS",
  SET_SNAPSHOTS_LOADED: "SET_SNAPSHOTS_LOADED",
  SET_TRANSACTIONS: "SET_TRANSACTIONS",
  SET_USERS: "SET_USERS",
  SET_ME: "SET_ME"
} as const;

export interface Mutations {
  [MutationTypes.SET_ASSETS](state: State, data: Asset[]): void;
  [MutationTypes.ADD_ADDITION_ASSET](state: State, data: Asset): void;
  [MutationTypes.REMVOE_ADDITION_ASSET](state: State, data: Asset): void;
  [MutationTypes.SET_EXCHANGE_RATE](state: State, data: ExchangeRate[]): void;
  [MutationTypes.SET_SNAPSHOTS](state: State, data: Snapshot[]): void;
  [MutationTypes.SET_SNAPSHOTS_LOADED](state: State, value: boolean): void;
  [MutationTypes.SET_TRANSACTIONS](state: State, data: Transaction[]): void;
  [MutationTypes.SET_USERS](state: State, data: User): void;
  [MutationTypes.SET_ME](state: State, data: User): void;
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export enum ActionTypes {
  LOAD_ASSETS = "LOAD_ASSETS",
  LOAD_EXCHANGE_RATES = "LOAD_EXCHANGE_RATES",
  LOAD_SNAPSHOTS = "LOAD_SNAPSHOTS",
  LOAD_TRANSACTIONS = "LOAD_TRANSACTIONS",
  LOAD_USER = "LOAD_USER",
  LOAD_ME = "LOAD_ME"
}

export interface Actions {
  [ActionTypes.LOAD_ASSETS]({ commit }: AugmentedActionContext): void;
  [ActionTypes.LOAD_EXCHANGE_RATES]({ commit }: AugmentedActionContext): void;
  [ActionTypes.LOAD_SNAPSHOTS](
    { commit }: AugmentedActionContext,
    payload: { reload: boolean; asset: string }
  ): void;
  [ActionTypes.LOAD_TRANSACTIONS](
    { commit }: AugmentedActionContext,
    payload: { reload: boolean; destination: string; tag: string }
  ): void;
  [ActionTypes.LOAD_USER](
    { commit }: AugmentedActionContext,
    payload: { id: string; force: boolean }
  ): void;
  [ActionTypes.LOAD_ME](
    { commit }: AugmentedActionContext,
    payload: { id: string }
  ): void;
}

export type AppModuleType<S = State> = Omit<
  VuexStore<S>,
  "commit" | "getters" | "dispatch"
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
};
