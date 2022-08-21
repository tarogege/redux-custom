/**
 * 自定义实现文件可读流
 *
 * 第一次读文件 时，直接从buffer中读入文件
 * 之后的全是执行的入队操作，从而保证异步文件写操作，是按顺序执行
 * 在第一次文件读写完成后，尝试去清空队列
 */
const fs = require("fs");
const EventEmitter = require("events");

class Writable extends EventEmitter {
  constructor(path, enconding, options) {
    this.path = path;
    this.enconding = enconding;
    this.flags = options?.flags || "w";
    this.mode = options?.mode || 438;
    this.autoClose = options?.autoClose ?? true;
    this.fd = options?.fd || null;
    this.highWaterMark = 0;
    this.offset = 0;

    this.open();

    this.writing = false;
    this.writeLen = 0;
    this.buffer = Buffer.alloc(this.highWaterMark);
    this.flag = true;
  }

  open() {
    fs.open(this.path, this.enconding, (err, fd) => {
      if (err) {
        this.emit("error", err);
      } else {
        this.fd = fd;
      }
    });
  }

  write(chunk, cb) {
    if (typeof this.fd !== "number") {
      return this.once("open", () => this.write(chunk, cb));
    } else {
      // 对chunk进行处理，将其统一转化为buffer
      const newChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      if (this.writing) {
        // 将write和回调放入队列中
      } else {
        this.writing = true;
        this._write(newChunk, (...args) => {
          cb?.(...args);
          // 清空队列操作，再清空队列中，去重复调用_write方法
        });
      }
    }
  }
  _write(chunk, cb) {
    fs.write(
      this.fd,
      chunk,
      0,
      this.highWaterMark,
      this.offset,
      (err, writenBytes) => {
        if (err) {
          this.emit("error", err);
        } else {
          if (writenBytes) {
            this.offset += writenBytes;
          } else {
            cb?.();
          }
        }
      }
    );
  }
}
