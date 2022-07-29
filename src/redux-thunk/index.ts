// thunk-实现
// 区分异步和同步action
const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    // 在action里重新去触发了dispatch，重新走了一遍中间件流程
    action();
  }
  // 普通action交由下一个中间件处理
  next(action);
};

export default thunkMiddleware;
