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
  /**
   * useSyncExternalStore 订阅外部 store 的 React Hook
   * useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
   * subscribe：一个函数，接收一个单独的 callback 参数并把它订阅到 store 上。
   * getSnapshot：一个函数，返回组件需要的 store 中的数据快照。
   * 可选 getServerSnapshot：一个函数，返回 store 中数据的初始快照。
   * React 会用这些函数来保持组件订阅到 store 并在它改变时重新渲染
   * https://zh-hans.react.dev/reference/react/useSyncExternalStore
   */
  const slice = React.useSyncExternalStore(
    api.subscribe,
    () => selector(api.getState()),
    () => selector(api.getInitialState())
  );
  // 为自定义 Hook 添加调试信息，方便 React DevTools 显示
  React.useDebugValue(slice);
  return slice;
}

const createImpl = (createState) => {
  const api = createStore(createState);

  // 绑定 store api 到 useBoundStore
  const useBoundStore: any = (selector?: any) => useStore(api, selector);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};

export const create = (createState) => (createState ? createImpl(createState) : createImpl);
