// sage应用
import createSagaMiddleware from "redux-sage";
const sagaMiddle = new createSagaMiddleware();
// 交由applyMiddleware(sagaMiddle)注册
// sagaMiddle.run(自定义的sage函数)

// saga的好处，将异步操作从actionCreator中分离出来，交由中间件进行处理
import { takeEvery, put, all } from "redux-sage/effects";
