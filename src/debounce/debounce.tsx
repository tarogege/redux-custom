function debounce(fn, interval, options) {
  const timer = null;
  return () => {
    clearTimeout(timer);
    if (options?.immediate) {
      return fn?.();
    }
    setTimeout(() => fn?.(), interval);
  };
}
