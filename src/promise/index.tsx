class MyPromise {
  constructor(exector) {
    try {
      exector(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  result = null;
  err = null;
  status: "PENDING" | "FULLFILLED" | "REJECTED" = "PENDING";
  successCbArr = [];
  failCbArr = [];

  resolve(data) {
    if (this.status !== "PENDING") return;
    this.status = "FULLFILLED";
    this.result = data;

    while (this.successCbArr.length > 0) {
      this.successCbArr.shift()?.(this.result);
    }
  }
  reject(err) {
    if (this.status !== "PENDING") return;

    this.status = "REJECTED";
    this.err = err;

    while (this.failCbArr.length > 0) {
      this.failCbArr.shift()?.(this.err);
    }
  }

  then(successCb, failCb) {
    const that = this;
    const p1 = new MyPromise((resolve, reject) => {
      if (that.status === "FULLFILLED") {
        try {
          setTimeout(() => {
            const x = successCb(that.result);
            this.resolvePromise(p1, x, resolve, reject);
          });
        } catch (err) {
          reject(err);
        }
      } else if (that.status === "REJECTED") {
        try {
          setTimeout(() => {
            const x = failCb(this.err);
            this.resolvePromise(p1, x, resolve, reject);
          });
        } catch (err) {
          reject(err);
        }
      } else {
        this.successCbArr.push(successCb);
        this.failCbArr.push(failCb);
      }
    });
    return p1;
  }

  resolvePromise(p1, x, resolve, reject) {
    if (p1 === x) throw new Error();
    if (x instanceof MyPromise) {
      x.then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    }
    resolve(x);
  }

  catch(failCb) {
    this.then(null, failCb);
  }

  // all
  static all(promises) {
    const result = [];
    return new Promise((resolve, reject) => {
      const len = promises.length;
      for (let i = 0; i < len; i++) {
        try {
          promises[i]
            .then((data) => (result[i] = data))
            .catch((err) => {
              reject(err);
              // break;
            });
        } catch (err) {
          reject(err);
          break;
        }
      }

      resolve(result);
    });
  }

  finally(cb) {}
}

export default Promise;
