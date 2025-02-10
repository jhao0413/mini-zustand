type SetStateInternal<T> = {
  _(partial: T | Partial<T> | { _(state: T): T | Partial<T> }["_"], replace?: false): void;
  _(state: T | { _(state: T): T }["_"], replace: true): void;
}["_"];

export interface StoreApi<T> {
  // 设置状态
  setState: SetStateInternal<T>;
  // 获取状态
  getState: () => T;
  // 获取初始状态
  getInitialState: () => T;
  // 订阅状态变化
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
}

const createStoreImpl = (createState) => {
  // 获取 createState 返回值类型
  type TState = ReturnType<typeof createState>;
  type Listener = (state: TState, prevState: TState) => void;
  let state: TState;
  const listeners: Set<Listener> = new Set();

  const setState: StoreApi<TState>["setState"] = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;

    // 判断nextState和state是否是同一个对象，如果不是则更新state
    if (!Object.is(nextState, state)) {
      const prevState = state;

      // state = nextState;
      state =
        // 如果replace为true，则直接赋值给nextState
        // 如果replace为false，则将nextState和state合并
        replace ?? (typeof nextState !== "object" || nextState === null)
          ? (nextState as TState)
          : Object.assign({}, state, nextState);

      listeners.forEach((listener) => listener(state, prevState));
    }
  };

  const getState: StoreApi<TState>["getState"] = () => state;

  const subscribe: StoreApi<TState>["subscribe"] = (listener) => {
    listeners.add(listener);

    // 返回取消订阅功能
    return () => listeners.delete(listener);
  };

  const getInitialState: StoreApi<TState>["getInitialState"] = () => initialState;

  const api = { setState, getState, subscribe, getInitialState };
  // 初始化state
  const initialState = (state = createState(setState, getState, api));
  return api;
};

export const createStore = (createState) =>
  createState ? createStoreImpl(createState) : createStoreImpl;
