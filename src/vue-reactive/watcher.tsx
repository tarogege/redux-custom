import Dep from "./dep";
class Watcher {
  constructor(vue, key, cb) {
    this.vue = vue;
    this.key = key;
    this.cb = cb;

    Dep.target = this;
    this.oldValue = this.vue[key];
    Dep.target = null;
  }

  notify() {
    const newValue = this.vue[key];
    if (newValue === this.oldValue) return;
    this.cb?.(newValue);
  }
}

export default Watcher;
