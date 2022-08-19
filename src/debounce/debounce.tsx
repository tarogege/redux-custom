function debounce(fn, interval, options) {
  let timer = null;
  const b = (...args) => {
    clearTimeout(timer);
    timer = null;
    if (options?.immediate) {
      return fn?.apply(this, args);
    }
    setTimeout(() => fn?.apply(this, args), interval);
  };

  b.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };

  return b;
}

export default debounce;
