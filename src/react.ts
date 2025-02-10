import React from "react";
import { createStore } from "./vanilla.ts";
import type { StoreApi } from "./vanilla.ts";

type ReadonlyStoreApi<T> = Pick<StoreApi<T>, "getState" | "getInitialState" | "subscribe">;

const identity = <T>(arg: T): T => arg;
export function useStore(api);
export function useStore(api, selector);

export function useStore<TState, StateSlice>(
  api: ReadonlyStoreApi<TState>,
  selector: (state: TState) => StateSlice = identity as any
) {
  const slice = React.useSyncExternalStore(api.subscribe, () => selector(api.getState()));
  React.useDebugValue(slice);
  return slice;
}

export type UseBoundStore<S extends ReadonlyStoreApi<unknown>> = {
  ();
  <U>(selector: (state) => U): U;
} & S;

const createImpl = (createState) => {
  const api = createStore(createState);

  const useBoundStore: any = (selector?: any) => useStore(api, selector);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};

export const create = (createState) => (createState ? createImpl(createState) : createImpl);
