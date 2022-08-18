// 将data处理成响应式
import Dep from "./dep";
class Observer {
  constructor(data) {
    this.data = data;
    this.walk(this.data);
  }

  walk(data) {
    if (!data || typeof data === "object") return;
    for (let [key, value] of Object.entries(data)) {
      this.defineReactive(this, key, value);
    }
  }

  defineReactive(vue, key, value) {
    this.walk(value);
    const dep = new Dep();
    Object.defineProperty(vue, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (Dep.target) {
          dep.addSubs(Dep.target);
        }
        return value;
      },
      set(newvalue) {
        dep.update();
        value = newvalue;
        this.walk(value);
      }
    });
  }
}

export default Observer;
