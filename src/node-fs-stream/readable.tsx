/**
 * 自定义文件可读流
 */
const fs = require('fs')
const EventEmitter  = require('events')

class Readable extends EventEmitter {
  constructor(path, encoding, options) {
    this.path = path
    this.encoding = encoding
    this.flags = options?.flags || 'r'
    this.mode = options?.mode || 438
    this.autoClose = options?.autoClose ?? true
    this.start = options?.start || 0
    this.end = options?.end || null
    this.fd = null
    this.highWaterMark = options?.highWaterMark || 64 * 1024
    this.offset = this.start

    this.buffer = Buffer.alloc(this.highWaterMark)
    this.open()
    this.on('newListener', (type) => {
      if (type === 'data') {
        // 触发的是data事件的时候，从fs中读取
        this.read()
      }
    })
  }

  open() {
    fs.open(this.path, this.encoding, (err, fd) => {
      if (err) {
        this.emit('error', err)
      } else {
        this.fd = fd
        this.emit('open', fd)
      }
    })
  }
  read() {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this.read)
    } else {
      const howMuchToRead = this.end ? Math.min(this.highWaterMark, this.end - this.offset) : this.highWaterMark
      fs.read(this.fd, this.buffer, this.start, howMuchToRead, this.offset, (err, readBytes, chunk) => {
        if (err) {
          this.emit('error', err)
        } else {
          if (readBytes > 0) {
            this.offset += readBytes
            this.emit('data', chunk)
            this.read()
          } else {
            this.emit('end')
            this.emit('close')
          }
        }
      })
    }
  }
}