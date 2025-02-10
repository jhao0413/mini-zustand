## Mini Zustand

这是一个简单实现的 [Zustand](https://github.com/pmndrs/zustand) 状态管理库的项目。它提供了一种轻量级的方式来管理 React 应用中的全局状态。

仅包含 zustand 的核心功能，另外添加了中文注释，适合学习理解 zustand 的源码实现。

### 项目结构

- src/vanilla.ts: 核心状态管理逻辑。
- src/react.ts: 实现自定义 React hook
- examples/: 使用示例

### 使用方法

```javascript
import { create } from "../../src/react";

const useStore = create((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));
```
