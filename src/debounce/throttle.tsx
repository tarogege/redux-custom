// 时间戳 时间段内开始的时候，即最后一次不执行
function throttleTimestap(fn, wait) {
  // let old = new Date().valueOf()
  // 如果old初始化为当前日期的话，即第一次也不执行了，初始化为0时，第一次会执行
  let old = 0;
  return (...args) => {
    const now = new Date().valueOf();
    if (now - old >= wait) {
      fn.apply(this, args);
      old = now;
    }
  };
}

// 计时器 时间段内结束的时候，即第一次不执行
function throttleTimer(fn, wait) {
  let timer = null;
  return (...args) => {
    if (!timer) {
      setTimeout(() => {
        fn?.apply(this, args);
        timer = null;
      }, wait);
    }
  };
}

// 计时器+时间戳
function throttleMix(fn, wait, options) {
  let old = new Date().valueOf();
  let timer = null;
  return (...args) => {
    const now = new Date().valueOf();
    if (options?.leading === false) {
      old = now;
    }
    if (now - old > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      old = now;
    } else if (!timer && options?.trailing !== false) {
      const remain = now - old;
      timer = setTimeout(() => {
        fn?.apply(this, args);
        timer = null;
      }, remain);
    }
  };
}

// lodash中通过debouce来实现节流 通过配置maxwait参数实现
// lodash中的debounce的实现也是通过时间戳+计时器相结合的方式

// export default throttle
