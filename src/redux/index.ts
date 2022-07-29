export const createStore = (reducer, initialState, enhancer) => {
  // 接收reducer，初始状态值，和对createStore的增强函数
  // 返回 getState，dispatch，subscribe

  // TODO: 对参数类型进行判断

  let currentState = reducer();
  // 发布订阅数组
  const subscribeArr = [];

  const getState = () => currentState;

  const subscribe = (fn) => subscribeArr.push(fn);

  const dispatch = (action) => {
    currentState = reducer(currentState, action);
    subscribeArr.forEach((item) => item?.());
  };

  return { getState, subscribe, dispatch };
};

// redux内置的生成enhancer函数的函数
// 用于应用插件
const compose = (secondeLayer) => (dispatch) => {
  let newDispatch = dispatch;
  const len = secondeLayer.length;

  // 从后往前遍历
  for (let i = len - 1; i >= 0; i++) {
    // 第二层执行完后返回了第三层函数，并将第三层函数赋值给前一个的next
    newDispatch = secondeLayer[i]?.(newDispatch);
  }

  return newDispatch;
};

export const applyMiddleware = (...middlewareArr) => (createStore) => (
  reducer,
  initialState
) => {
  // TODO: 对初始参数的判断

  const store = createStore(reducer, initialState);
  const { dispatch, getState } = store;

  // middleare函数的格式 store => next => action => {}
  // 传进去store是没有subscribe的改良版的store
  const secondeLayer = middlewareArr.map((item) =>
    item?.({ dispatch, getState })
  );
  // 这里如果不用闭包，而直接传第二个参数？？？
  const newDispatch = compose(secondeLayer)(dispatch);
  return { ...store, dispatch: newDispatch };
};

// bindActionCreators
// 用于将返回action的函数 生成 成 dispatch action 的函数，常用于mapDispatchToProps
export const bindActionCreators = (actionCreators, dispatch) => {
  // actionCreators，对象，里面全是生成action的函数
  // 这里需要使用立即执行函数，对key值进行闭包？？？
  const result = {};
  for (let [key, value] of Object.entries(actionCreators)) {
    result[key] = (payload) => dispatch((value as any)?.(payload));
  }
  return result;
};

// combineReducers
// 用于将多个子reducers合并成一个reducer
export const combineReducers = (subReducers) => (state, action) => {
  // subReducers 子reducer对象
  for (let [key, subReducer] of Object.entries(subReducers)) {
    state[key] = (subReducer as any)?.(state?.[key], action);
  }
  return state;
};

// 工具函数 判断是否是一个obj typeOf,可能是obj，array，null
// 通过根原型链来判断，或者Array.isArray(),这个函数有兼容性问题，需要添加polyfill
export const isObj = (value) => {
  if (typeof value !== "object" || value === null) return false;
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  if (proto !== Object.getPrototypeOf(value)) return false;
  return true;
};
