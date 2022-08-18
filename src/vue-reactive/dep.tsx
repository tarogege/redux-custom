// 观察者模式中的 观察目标
class Dep {
  subs = [];

  addSubs(watcher) {
    this.subs.push(watcher);
  }

  update() {
    this.subs.forEach((watcher) => {
      watcher?.notify();
    });
  }
}

export default Dep;
