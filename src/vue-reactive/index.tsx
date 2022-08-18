/**
 * vue2 中响应式通过defineProperty实现
 * vue3 中通过Proxy实现
 *
 * 主要是通过观察者模式实现
 */
import Observer from "./observer";
import Compiler from "./compiler";
class Vue {
  constructor(options) {
    this.options = options;
    this.data = options?.data || {};
    this.el =
      typeof options?.el === "string"
        ? document.getElementById(options?.el)
        : options?.el;

    // 遍历options数组把他们注入到vue实例中
    this.initData(this.data);
    new Observer(this.data);
    new Compiler(this, this.el);
  }

  initData(data) {
    for (let k of Object.keys(data)) {
      Object.defineProperty(this, k, {
        enumerable: true,
        configurable: true,
        get() {
          return data[k];
        },
        set(value) {
          data[k] = value;
        }
      });
    }
  }
}
